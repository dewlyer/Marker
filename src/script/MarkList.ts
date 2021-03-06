import * as $ from 'jquery';
import { Mark } from './Mark';

/**
 * MarkList Class
 */

export interface MarkListInterface {
    current: Mark;
    list: Mark[];
}

export class MarkList implements MarkListInterface {
    private _list: Mark[];
    private _current: Mark;

    public constructor(list: Mark[]) {
        this.initialize(list);
    }

    public get list(): Mark[] {
        return this._list;
    }

    public set list(list: Mark[]) {
        this._list = list;
    }

    public get current(): Mark {
        return this._current;
    }

    public set current(current: Mark) {
        this._current = current;
    }

    public getItemByIndex(index): Mark {
        return this._list[index];
    }

    public getItemById(id): Mark {
        return this._list[0];
    }

    public clone(markList: MarkList) {
        let list: Mark[] = [];
        let current: Mark;
        if (markList.list.length) {
            $.each(markList.list, function (index, mark) {
                let m = new Mark('', 0, 0, 0, 0);
                m.clone(mark);
                list.push(m);
            });
        }
        if (!!markList.current) {
            current = new Mark('', 0, 0, 0, 0);
            current.clone(markList.current);
        }
        this._list = list;
        this._current = current;
    }

    private initialize(list): void {
        this._list = list;
        this._current = list[0];
    }
}
