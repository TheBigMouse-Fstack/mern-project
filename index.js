import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import Random from "random";

const path = "./data.json";

// Hàm kiểm tra ngày hợp lệ
const isValidDate = (date) => {
  const startDate = moment("2024-01-01");
  const endDate = moment("2024-12-17");
  return date.isBetween(startDate, endDate, null, "[]");
};

// Hàm ghi commit
const markCommit = async (date) => {
  let commitData = [];
  try {
    commitData = await jsonfile.readFile(path); // Đọc dữ liệu cũ
  } catch (err) {
    commitData = []; // File trống hoặc không tồn tại
  }

  commitData.push({ date: date.toISOString() });
  await jsonfile.writeFile(path, commitData, { spaces: 2 });

  const git = simpleGit();
  await git.add([path]);
  await git.commit(date.toISOString(), { "--date": date.toISOString() });
};

// Hàm tạo commit ngẫu nhiên
const makeCommits = async (n) => {
  const git = simpleGit();

  for (let i = 0; i < n; i++) {
    const randomWeeks = Random.int(0, 52);
    const randomDays = Random.int(0, 6);

    const randomDate = moment("2024-01-01")
      .add(randomWeeks, "weeks")
      .add(randomDays, "days");

    if (isValidDate(randomDate)) {
      console.log(`Creating commit on ${randomDate.toISOString()}`);
      await markCommit(randomDate);
    } else {
      console.log(`Invalid date: ${randomDate.toISOString()}, Skipping...`);
    }
  }
  console.log("Pushing all commits...");
  await git.push();
};

makeCommits(500);
