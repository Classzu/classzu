import { ElementIds } from '../Global'

export function getUniqueStr(myStrong?: number): string {
  let strong = 1000;
  if (myStrong) strong = myStrong;
  return (
    new Date().getTime().toString(16) +
    Math.floor(strong * Math.random()).toString(16)
  );
}

export function getClasszuElement(id: string, id2: keyof typeof ElementIds): HTMLElement{
    const uniqueId = getClasszuElementId(id, id2);
    const guiElement : HTMLElement | null = document.getElementById(uniqueId)
    if (!guiElement) {
        new Error(`Cannot find element to add GUI, Searched by (#${uniqueId}`)
        const damyElement = document.createElement('div')
        return damyElement
    }
    return guiElement;
}

export function getClasszuElementId(id: string, id2: keyof typeof ElementIds) {
    return `${id}-${ElementIds[id2]}`
}

export function getPxString(num: number): string {
    return `${num}px`
}

export function createElementFromHTML(htmlString: string): Element | null {
    const tempEl = document.createElement('div');
    tempEl.innerHTML = htmlString;
    return tempEl.firstElementChild;
}