// Copyright (c) 2020 Debashish Patra, MPL-2.0

// FileSystemHelaper.ts
// Used to get filepaths, searching and indexing.

var XRegExp = require("xregexp");
var path = require("path");
import * as vscode from "vscode";
import { IsHeaderFile, IsSourceFile } from "./ExtensionHelper";
import { resolve, promises } from "dns";
import { rejects } from "assert";
import * as feedback from "./ErrorLogger";
import * as fs from "fs";
import * as _ from "lodash";

export interface FunctionAnatomy {
    prototype: string;
    returnType: string;
}

export interface PluginPathInfo {
    foldername: string;
    folderpath: string;
    isGameModule: boolean;
}

export interface SingleFileData {
    name: string;
    extension: string;
    path: string;
}

export enum ActiveFileExtension {
    None,
    Header,
    Source,
    BothFound,
}
export interface FileData {
    cppvalid: ActiveFileExtension;
    fullpath: string;
    filename: string;
    folderpath: string;
    stripped_classname: string;
    headerpath: string;
    sourcepath: string;
}

/** Gets all the information about currently focused file... */
export function GetActiveFileData(): FileData {
    let retval: FileData = {
        cppvalid: ActiveFileExtension.None,
        fullpath: "",
        filename: "",
        folderpath: "",
        stripped_classname: "",
        headerpath: "",
        sourcepath: "",
    };

    // Handle failstate
    if (vscode.window.activeTextEditor === null) {
        feedback.ThrowError(feedback.DErrorCode.HEADER_NOT_FOUND);
        return retval;
    }

    retval.fullpath = vscode.window.activeTextEditor!.document.fileName;
    retval.filename = path.basename(retval.fullpath);
    retval.folderpath = path.dirname(retval.fullpath);

    // Determine type of file
    if (IsHeaderFile(retval.filename)) {
        retval.cppvalid = ActiveFileExtension.Header;
        retval.headerpath = retval.fullpath;
        retval.stripped_classname = retval.filename.substring(0, retval.filename.length - 2);
    } else if (IsSourceFile(retval.filename)) {
        retval.cppvalid = ActiveFileExtension.Source;
        retval.sourcepath = retval.fullpath;
        retval.stripped_classname = retval.filename.substring(0, retval.filename.length - 4);
    }
    // Return success
    return retval;
}

/** Gets the .h counterpart if standard convention was respected. */
export async function GetMatchingHeader(
    data: FileData,
): Promise<void> {
    const regex = new XRegExp("^" + data.stripped_classname + ".h$");
    return new Promise<void>((resolve, reject) => {
        const a = ScanFolderWithRegex(data.folderpath, regex);
        const b = ScanFolderWithRegex(path.join(data.folderpath, "../", "Public"), regex);

        Promise.all([a, b]).then(values => {
            if (values[0] !== "") {
                data.headerpath = path.join(data.folderpath, values[0]);
                resolve();
            }
            else if (values[1] !== "") {
                data.headerpath = path.join(data.folderpath, "../Public", values[1]);
                resolve();
            }
            else { reject(feedback.DErrorCode.HEADER_NOT_FOUND); }
        });
    });
}

/** Gets the .cpp counterpart if standard convention was respected. */
export async function GetMatchingSource(
    data: FileData,
): Promise<string> {
    const regex = new XRegExp("^" + data.stripped_classname + ".cpp$");
    return new Promise<string>((resolve, reject) => {
        const a = ScanFolderWithRegex(data.folderpath, regex);
        const b = ScanFolderWithRegex(path.join(data.folderpath, "../", "Private"), regex);

        Promise.all([a, b]).then(values => {
            if (values[0] !== "") {
                console.log("found in same folder.");
                data.sourcepath = path.join(data.folderpath, values[0]);
                resolve(path.join(data.folderpath, values[0]));
            }
            else if (values[1] !== "") {
                console.log("found in one folder outside.");
                data.sourcepath = path.join(data.folderpath, "../", "Private", values[1]);
                resolve(path.join(data.folderpath, "../", "Private", values[1]));
            }
            else { reject(feedback.DErrorCode.SOURCE_NOT_FOUND); }
        });
    });
}

/** Scan a folder with specified regex to find matches. Empty string if none found. */
export async function ScanFolderWithRegex(
    dir: string,
    ex: RegExp,
): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fs.readdir(dir, (err: any, files: any) => {
            if (err) { resolve(""); }
            files.forEach((file: string) => {
                if (ex.test(file)) {
                    resolve(file);
                }
            });
            resolve("");
        });
    });
}

/** Writes a function definition. (Expects the name of clas to be provided) */
export async function WriteFunctionToFile(filepath: string, funcBody: FunctionAnatomy, classname: string): Promise<void> {
    console.log("Filestream started execution...");

    let mine = "\n" + funcBody.returnType + " A" + classname + funcBody.prototype;
    return new Promise<void>((resolve, reject) => {
        fs.appendFile(filepath, mine, (err: any) => {
            console.log('Probably file is being blocked...');
        });

        let placeholderBody = "\t// UE_LOG(LogTemp, Warning, TEXT(\"A property was changed in right panel.\"))";
        // Let users have a bracket style preference...
        let PreferredBrackets = "\n{\n" + placeholderBody + "\n}";

        fs.appendFile(filepath, PreferredBrackets, (err: any) => {
            if (err) { } // handle error
            console.log('Filenot found!');
        });
        resolve();
    });
}

export async function WriteAtLine(filepath: string, at: number, lines: string[], freshFile?: boolean): Promise<void> {

    // Handle request for starting from black
    if(freshFile && freshFile === true){
        fs.writeFileSync(filepath, "");
    }

    // Handle FILE DOES NOT EXIST
    if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, "");
    }

    let content: string = "";
    lines.forEach((str, i) => {
        if(i === content.length - 1){
            content += str;
        }else{
            content += str + "\n";
        }
    });
    return new Promise<void>((resolve, reject) => {
        let data: string[] = fs.readFileSync(filepath).toString().split("\n");
        data.splice(at, 0, content);
        console.log(data);
        // Using filestream
        let stream = fs.createWriteStream(filepath)
            .on("error", () => {
                console.log("Some error occured...");
            })
            .on("finish", () => {
                resolve();
            });
        data.forEach((line, i) => {
            if(i === data.length - 1)
                { stream.write(line); }
            else
                { stream.write(line + "\n"); }
        });
        stream.end();
    });
}

/** Scans a folder for a .uplugin file and valid Source folder. Returns list of plugin
 * paths as would be detected in the engine.
 * @param folder : Potential plugin folder with .uplugin */
export function GetPluginDataFromFolder(folder: string): PluginPathInfo[] {
    let targetpath = path.join(folder, "Source");
    let retval: PluginPathInfo[] = [];
    try {
        let folders = fs.readdirSync(targetpath);
        // Every folder in a valid plug-in foler is assumed to be a module...
        _.each(folders, (folder) => {
            if (fs.statSync(path.join(targetpath, folder)).isDirectory() === true) {
                retval.push({
                    foldername: folder,
                    folderpath: path.join(targetpath, folder),
                    isGameModule: false
                });
            }
        });
        // Filter out specific folders...
        _.filter(retval, (o) => { ((o.foldername !== "Python") && (o.foldername !== "Shaders")); });
        return retval;
    }
    catch {
        return retval;
    }
}

export function GetFolderList(targetpath: string): string[] {
    let retval: string[] = [];
    try {
        let folders = fs.readdirSync(targetpath);
        // Every folder in a valid plug-in foler is assumed to be a module...
        _.each(folders, (folder) => {
            if (fs.statSync(path.join(targetpath, folder)).isDirectory() === true) {
                retval.push(folder);
            }
        });
        return retval;
    }
    catch {
        return retval;
    }
}

export function ConfirmFileExists(targetfilepath: string): number {
    if (fs.existsSync(targetfilepath)) {
        return 0;
    }
    else {
        fs.writeFileSync(targetfilepath, "");
        return 0;
    }
}

export async function WriteLinesToFile(filepath: string, lines: string[]): Promise<void> {
    let writer = fs.createWriteStream(filepath);
    lines.forEach((line) => {
        writer.write(line);
    });
    writer.close();
}