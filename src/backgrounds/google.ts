import type { Saves } from "~settings";
import { defaultSaves } from "~settings";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getClasses = async (sendResponse?: (response: any) => void) => {
  try {
    console.log("getClasses Start");

    // 毎回ログイン画面になるのは嫌なので、ログイン済みかどうかをstorageから取得
    // トークンを取得
    const token = await new Promise((resolve, reject) => {
      chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
        const interactive = !currentData.settings.googleClassroom.isSignedIn;
        chrome.identity.getAuthToken({ interactive }, (token) => {
          if (chrome.runtime.lastError || !token) {
            reject(chrome.runtime.lastError || "トークン取得に失敗しました。");
          } else {
            resolve(token);
          }
        });
      });
    });

    // メールアドレスを取得
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const profile = await profileResponse.json();
    console.log("profile", profile);

    if (sendResponse) {
      sendResponse({ profile });
    }

    // クラス一覧を取得
    const coursesResponse = await fetch("https://classroom.googleapis.com/v1/courses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const courses = await coursesResponse.json();

    // 各クラスの課題を取得
    const courseWorkResponses = await Promise.all(
      (courses.courses || []).map((course) =>
        fetch(`https://classroom.googleapis.com/v1/courses/${course.id}/courseWork`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ),
    );

    console.log("wait courseWorkResponses");
    const courseWorks = await Promise.all(courseWorkResponses.map((response) => response.json()));

    const tasks = [];
    const now = new Date();

    courseWorks.forEach((courseWork, index) => {
      const course = courses.courses[index];
      console.log(courseWork);

      courseWork.courseWork.forEach(async (work) => {
        if (!work.dueDate) return;
        const dueDate = new Date(
          work.dueDate.year,
          work.dueDate.month,
          work.dueDate.day,
          work.dueTime?.hours ?? 23,
          work.dueTime?.minutes ?? 59,
        );
        if (dueDate < now) return;

        tasks.push({
          kind: "classroomTask",
          course: course.name,
          courseId: work.courseId,
          courseURL: course.alternateLink,
          title: work.title,
          link: work.alternateLink,
          deadline: `${work.dueDate.year}-${work.dueDate.month}-${work.dueDate.day} ${work.dueTime?.hours ?? 23}:${work.dueTime?.minutes ?? 59}`,
          id: work.id,
        });
      });
    });

    const submissionResponse = await Promise.all(
      tasks.map((task) =>
        fetch(`https://classroom.googleapis.com/v1/courses/${task.courseId}/courseWork/${task.id}/studentSubmissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ),
    );

    const submissionsData = await Promise.all(submissionResponse.map((response) => response.json()));

    console.log(submissionsData);

    const submissions = submissionsData.map((data) => data.studentSubmissions || []);

    const noSubmittedTasks = tasks.map((task, index) => {
      return {
        isSubmitted: !submissions[index]
          .map((submission) => ["CREATED", "RECLAIMED_BY_STUDENT"].includes(submission.state))
          .some(Boolean),
        ...task,
      };
    });

    console.log("noSubmittedTasks", noSubmittedTasks);

    chrome.storage.local.get(defaultSaves, (currentData: Saves) => {
      currentData.scombzData.classroomTasklist = noSubmittedTasks.filter((task) => !task.isSubmitted);
      chrome.storage.local.set(currentData, () => {
        console.log("classroomTasklist saved");
      });
    });
    console.log("getClasses End");
  } catch (error) {
    console.error("課題取得エラー:", error);
    sendResponse({ error });
  }
};

export const logoutGoogle = () => {
  chrome.identity.clearAllCachedAuthTokens(() => {
    console.log("removed cache");
  });
  const url = chrome.identity.getRedirectURL();
  console.log("logoutGoogle", url);
  chrome.tabs.create({ url: `https://accounts.google.com/logout` });
};
