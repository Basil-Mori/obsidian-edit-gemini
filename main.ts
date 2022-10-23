import { normalize } from "node:path/win32";
import {Plugin, normalizePath } from "obsidian";


export default class GeminiEditor extends Plugin {

	createGMI(folder? : string) {
		// const fm = app.fileManager as any
		if ( !folder ) {
			folder = app.fileManager.getNewFileParent(app.workspace.getActiveFile()?.path || '').path
		}
		// if (folder == "/") {
		// 	folder = ""
		// }

		const files = app.vault.getFiles()
		const filepaths : string[] = []
		files.forEach( (file) => {
			// new Notice(file.parent.path)
			// if ( file.parent.path == folder ) {
				filepaths.push(file.path)
				// new Notice(file.path)
			// }
		})
		let filename = normalizePath(folder + "/Untitled.gmi")

		if (!filepaths.contains(filename)) {
			app.vault.create(filename, "")
		} else {
			let iter = 0
			while (true) {
				iter = iter + 1
				let filename = normalizePath(folder + "/Untitled " + iter + ".gmi")
				if (!filepaths.contains(filename)) {
					app.vault.create(filename, "")
					break
				}
			}
		}


	}

	async onload() {
		console.log('loading plugin: Gemini');

		this.registerExtensions(["gmi"], "markdown");

		this.addRibbonIcon('add-note-glyph', 'New Gemtext', (evt: MouseEvent) => {
			this.createGMI()
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
			  menu.addItem((item) => {
				item
				  .setTitle("New Gemtext")
				  .setIcon("add-note-glyph")
				  .onClick(async () => {
					  let folder : string
					  const fname = file.path
					  if( fname.search("(\\.[^.]+)$") > 0 ) {
						folder = file.parent.path
						// if (folder != "/") {
						// 	folder = folder + "/"
						// }
					  } else {
						folder = fname
					  }
					  this.createGMI(folder)
				  });
			  });
			})
		  );
	}

	onunload() {
		console.log('unloading plugin: Gemini');
	}

}
