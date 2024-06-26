const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const budgetFolderPath = path.join(__dirname, "storage", "budgetList");

// Method to read budget from a file
function get(budgetId) {
  try {
    const filePath = path.join(budgetFolderPath, `${budgetId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadBudget", message: error.message };
  }
}

// Method to write budget to a file
function create(budget) {
  try {
    budget.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(budgetFolderPath, `${budget.id}.json`);
    const fileData = JSON.stringify(budget);
    fs.writeFileSync(filePath, fileData, "utf8");
    return budget;
  } catch (error) {
    throw { code: "failedToCreateBudget", message: error.message };
  }
}

// Method to update budget in a file
function update(budget) {
  try {
    const currentBudget = get(budget.id);

    if (!currentBudget) return null;

    const newBudget = { ...currentBudget, ...budget };

    const filePath = path.join(budgetFolderPath, `${budget.id}.json`);
    const fileData = JSON.stringify(newBudget);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newBudget;
  } catch (error) {
    throw { code: "failedToUpdateBudget", message: error.message };
  }
}

// Method to remove budget from a file
function remove(budget) {
  try {
    const filePath = path.join(budgetFolderPath, `${budget}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw { code: "failedToRemoveBudget", message: error.message };
  }
}

// Method to list budget in a folder
function list() {
  try {
    const files = fs.readdirSync(budgetFolderPath);

    const budgetList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(budgetFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });

    return budgetList;
  } catch (error) {
    throw { code: "failedToListBudget", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
};
