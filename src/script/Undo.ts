function removeFromTo(array, from: number, to: number) {
    array.splice(from,
        !to ||
        1 + to - from + (
            Number(!((to < 0) !== (from >= 0)) && (to < 0 || -1)) * array.length
        )
    );
    return array.length;
}

export let UndoManager =  function () {
    this.commands = [];
    this.index = -1;
    this.limit = 0;
    this.isExecuting = false;
    this.callback = null;

    // functions
    this.execute = function (command, action) {
        if (!command || typeof command[action] !== 'function') {
            return this;
        }
        this.isExecuting = true;

        command[action]();

        this.isExecuting = false;
        return this;
    };
};

UndoManager.prototype = {

    /*
    Add a command to the queue.
    */
    add: function (command) {
        if (this.isExecuting) {
            return this;
        }
        // if we are here after having called undo,
        // invalidate items higher on the stack
        this.commands.splice(this.index + 1, this.commands.length - this.index);

        this.commands.push(command);

        // if limit is set, remove items from the start
        if (this.limit && this.commands.length > this.limit) {
            removeFromTo(this.commands, 0, -(this.limit + 1));
        }

        // set the current index to the end
        this.index = this.commands.length - 1;
        if (this.callback) {
            this.callback();
        }
        return this;
    },

    /*
    Pass a function to be called on undo and redo actions.
    */
    setCallback: function (callbackFunc) {
        this.callback = callbackFunc;
    },

    /*
    Perform undo: call the undo function at the current index and decrease the index by 1.
    */
    undo: function () {
        let command = this.commands[this.index];
        if (!command) {
            return this;
        }
        this.execute(command, 'undo');
        this.index -= 1;
        if (this.callback) {
            this.callback();
        }
        return this;
    },

    /*
    Perform redo: call the redo function at the next index and increase the index by 1.
    */
    redo: function () {
        let command = this.commands[this.index + 1];
        if (!command) {
            return this;
        }
        this.execute(command, 'redo');
        this.index += 1;
        if (this.callback) {
            this.callback();
        }
        return this;
    },

    /*
    Clears the memory, losing all stored states. Reset the index.
    */
    clear: function () {
        let prev_size = this.commands.length;

        this.commands = [];
        this.index = -1;

        if (this.callback && (prev_size > 0)) {
            this.callback();
        }
    },

    hasUndo: function () {
        return this.index !== -1;
    },

    hasRedo: function () {
        return this.index < (this.commands.length - 1);
    },

    getCommands: function () {
        return this.commands;
    },

    getIndex: function () {
        return this.index;
    },

    setLimit: function (l) {
        this.limit = l;
    }
};
