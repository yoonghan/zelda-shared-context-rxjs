import fs from "fs";

const mainFile = "walcron-zelda-shared-context";
const declarationPath = "./declaration";
const outputDir = "./dist/typings/";
const typingFile = outputDir + "types.d.ts";

fs.mkdirSync(outputDir, { recursive: true });

try {
  fs.rmSync(typingFile);
} catch (e) {
  //ignore
}

const getFiles = (srcpath: string): string[] => {
  return fs
    .readdirSync(srcpath, {
      withFileTypes: true,
    })
    .flatMap((file: File & { isDirectory: () => boolean }) => {
      const relativePath = `${srcpath}/${file.name}`;
      if (file.isDirectory()) {
        return getFiles(relativePath);
      } else {
        return relativePath;
      }
    });
};

const allDeclarationFiles = getFiles(declarationPath);
console.log(allDeclarationFiles);
const declarationFileExceptMain = allDeclarationFiles.filter(
  (fileName) => fileName !== `${declarationPath}/${mainFile}.d.ts`
);

fs.appendFileSync(
  typingFile,
  `declare module "@walcron/zelda-shared-context" {\n`
);

declarationFileExceptMain.forEach((fileName) => {
  const fileContent = fs.readFileSync(fileName, "utf-8");
  const fileContentWithoutDeclare = fileContent.replace("declare ", "");
  fs.appendFileSync(typingFile, fileContentWithoutDeclare);
});

fs.appendFileSync(typingFile, `}`);

console.log(`Successfully Written to ${typingFile}.`);
console.log(
  `Please include typing into project by adding ${typingFile} into tsconfig.json's include`
);
