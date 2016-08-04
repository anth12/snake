Array.prototype.contains = function (obj) {
    var i = this.length -1;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

Array.prototype.first = function (predicate?: (t: any)=> boolean) {
    var i = 0;
    while (i < this.length) {
        if (predicate == null || predicate(this[i])) {
            return this[i];
        }
        i++;
    }
    return null;
}

Array.prototype.last = function (predicate?: (t: any)=> boolean) {
    var i = this.length -1;
    while (i >= 0) {
        if (predicate == null || predicate(this[i])) {
            return this[i];
        }
        i++;
    }
    return null;
}

Array.prototype.selectMany = function (predicate: (t: any)=> Array<any>) {
    let result = new Array();
    let i = 0;
    while (i < this.length) {
        result.push.apply(result, predicate(this[i]));
        i++;
    }
    return result;
}


Array.prototype.skip = function (number: number) {
    return this.slice(number, this.length);
}

Array.prototype.take = function (number: number) {
    return this.slice(0, number);
}


interface Array<T> {
   contains(o: T): boolean;   
   
   first(predicate?: (item: T) => boolean): T;
   last(predicate?: (item: T) => boolean): T;

   skip(number: number): Array<T>;
   take(number: number): Array<T>;

   selectMany<R>(predicate: (item: T) => Array<R>): Array<R>;
}