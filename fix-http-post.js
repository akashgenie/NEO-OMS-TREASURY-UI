const fs = require("fs");
const path = require("path");

function walk(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (
      fullPath.includes("node_modules") ||
      fullPath.includes(".git") ||
      fullPath.includes("dist")
    ) {
      return;
    }

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith(".ts")) {
      fixFile(fullPath);
    }
  });
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  const original = content;

  // http.post(url)
  content = content.replace(
    /this\.http\.post(<[^>]+>)?\(\s*([^,\n]+?)\s*\)/g,
    "this.http.post$1($2, {})"
  );

  // multiline post(url)
  content = content.replace(
    /(this\.http\.post(?:<[^>]+>)?\(\s*[\s\S]*?\))\s*;/gm,
    (match) => {
      if (match.includes(", {}") || match.includes(", null")) {
        return match;
      }

      const lastParen = match.lastIndexOf(")");

      return (
        match.substring(0, lastParen) +
        ", {}" +
        match.substring(lastParen)
      );
    }
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log("Fixed:", filePath);
  }
}

walk("./src");

console.log("Done!");
