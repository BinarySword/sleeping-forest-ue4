// Copyright (c) 2020 Debashish Patra, MPL-2.0

// IncludeManager.ts
// Isolated module to handle header inclusion. Refer database at IncludeMapping.json


import * as vscode from "vscode";
import { resolve } from "dns";
import * as edit from "../utils/EditorHelper";
import data from "../data/IncludeMapping.json";

export async function QuickPick(arr: string[], doCompare: boolean, compareTo?: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        vscode.window.showQuickPick(arr).then((retval) => {
            if (doCompare) {
                ((retval === compareTo) && doCompare) ?
                    resolve(retval) :
                    reject("MISMATCH");
            }
            else { resolve(retval); }
        }, () => {
            reject("ABORT");
        });
    });
}

export async function InputBox(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const input = vscode.window.showInputBox(); // request classname as string
        input.then((value) => {
            (typeof value !== "undefined") ? resolve(value) : reject("UNDEF");
        }, () => { resolve("ABORT"); });
    });
}