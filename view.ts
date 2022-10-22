import { TextFileView, Notice } from "obsidian";

export const VIEW_TYPE_GMI = "gmi-view";

export class GMIView extends TextFileView {
  fileLines: string[];
  fileDIV: HTMLElement;

  getViewData() {
    // return this.data;
    return this.fileLines.join("\n")
  }

  setViewData(data: string, clear: boolean) {
    // this.data = data;
    this.fileLines = data.split("\n");
    // this.fileLines.forEach((line, i) => {
    //   this.fileLines[i] = line + "\n"
    // });

    // this.contentEl.empty();
    // this.contentEl.createDiv({ text: this.data });
    this.refresh()
  }

  async onOpen() {
    this.fileDIV = this.contentEl.createEl("div", {cls: "fileDIV", attr: {contenteditable: "true", spellcheck:"false"}, });

    this.fileDIV.oninput = (ev) => {
      this.style(this.fileDIV)

      if (ev.currentTarget instanceof HTMLDivElement) {

        const allchilds = ev.currentTarget.childNodes
        this.fileLines = []
        allchilds.forEach( (child: HTMLParagraphElement) => {
          // child.get
          if (child.textContent) {
            // new Notice(child.textContent)
            // new Notice(child.getText())
            // new Notice(child.textContent)
            this.fileLines.push(child.textContent)
          } else {
            // new Notice( "")
            this.fileLines.push("")
          }
        })

        this.requestSave();
      }
    }
  }

  style(source : HTMLElement) {
    const allchilds = source.childNodes
    let preformatted: true | false
    preformatted = false


    allchilds.forEach( (child: HTMLParagraphElement) => {

        /* all of this messes too much with edit history */
      // if ( child.hasChildNodes() ) {
      //   this.style(child)

      //   child.childNodes.forEach( (subchild :HTMLElement) => {
      //     if ( subchild instanceof HTMLSpanElement /*|| subchild instanceof HTMLParagraphElement*/) {
      //       let subchildtext = subchild.textContent
      //       new Notice("Something went weird around: " + subchildtext)

      //       if (subchildtext) {
      //         // child.appendText(subchildtext)
      //         let newchild = child.createEl("p", {cls: "basic", text: subchildtext})
      //         // subchild.replaceWith(newchild)
      //         subchild.remove()
      //       }
      //       else {
      //         subchild.remove()
      //       }
      //       // subchild.remove()

      //       // subchild.
      //       // child.parentNode?.removeChild(child, true)
      //       // child.replaceWith(subchild)
      //     }
      //     else if ( subchild instanceof HTMLParagraphElement ) {
      //       let subchildtext = subchild.textContent
      //       new Notice("Paraweird around: " + subchildtext)

      //       if (subchildtext) {
      //         let newchild = child.createEl("p", {cls: "basic", text: subchildtext} )
      //       }
      //     }
      //   });
      // }

      if (child.textContent) {

        let linetext = child.textContent

        if (linetext.startsWith("```")) {
          preformatted = !preformatted
          child.className = "preformatted"
        }
        else if (preformatted == true) {
            child.className = "preformatted"
        }
        else if (linetext.startsWith("# ")) {
          child.className = "h1"
        }
        else if (linetext.startsWith("## ")) {
          child.className = "h2"
        }
        else if (linetext.startsWith("### ")) {
          child.className = "h3"
        }
        else if (linetext.startsWith("=>")) {
          child.className = "link"
        }
        else if (linetext.startsWith("* ")) {
          child.className = "list"
        }
        else if (linetext.startsWith(">")) {
          child.className = "blockquote"
        }
        else {
          child.className = "basic"
        }
      }
      else {
        if (preformatted == true) {
          child.className = "preformatted"
        }
        else {
          child.className = "basic"
        }
      }

    });
  }
  
  
  async onClose() {
    this.contentEl.empty();
  }

  refresh() {
    this.fileDIV.empty();

    this.fileLines.forEach((line, i) => {
      if (line == "") {
        this.fileDIV.createEl("br")
      } else {
        const lineelement = this.fileDIV.createEl("p", 
          {text: line, 
          // {text: this.data,
            cls: "basic", 
            // attr: {contenteditable: "true"}
          });

      // lineelement.append()
      // lineelement.createEl("a", { text: "test", attr: {href: "https://google.com"}})
      // };
    //   lineelement.oninput = (ev) => {
    //     // this.fileDIV.oninput = (ev) => {
    //     if (ev.currentTarget instanceof HTMLParagraphElement) {
    //       new Notice("input changed");
    //       this.fileLines[i] = ev.currentTarget.getText();
    //       // this.data = ev.currentTarget.getText();
    //       this.requestSave();
    //     }
      }
    });
    this.style(this.fileDIV)
  }

  clear() {
    this.fileLines = [];
    // this.data = "";
  }

  getViewType() {
    return VIEW_TYPE_GMI;
  }
}