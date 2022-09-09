'use strict';
const sorted = [];
function sortUniqueNames(names, prevNames) {
    const result = [];
    names.forEach(name => {
        if (prevNames.indexOf(name) == -1) {
            result.push(name);
        }
    });
    return Array.from(new Set(result));
}
function isBest(friend) {
    if ('best' in friend) {
        sorted[0] = sorted[0] ? [...sorted[0], ...friend.friends] : [...friend.friends];
        sorted[0] = Array.from(new Set(sorted[0].sort()));
        return true;
    }
    return false;
}
function isCloseFriend(friend, level) {
    if (sorted[level - 1].includes(friend.name)) {
        sorted[level] = sorted[level] ? [...sorted[level], ...friend.friends] : [...friend.friends];
        sorted[level] = sortUniqueNames(sorted[level].sort(), sorted[level - 1].sort());
        return true;
    }
    return false;
}
function sortAlthabeticaly(a, b) {
    const name = a.toLowerCase();
    const nextName = b.toLowerCase();
    if (name < nextName) {
        return -1;
    }
    else if (name > nextName) {
        return 1;
    }
    return 0;
}
function isDone(friends, level, counter, limit) {
    if (!sorted[level - 1] || level == limit || counter >= friends.length) {
        return true;
    }
    else if (level + 1 == limit && isCloseFriend(friends[counter + 1], level) !== true) {
        return true;
    }
    return false;
}
function inviteBesties(friends, filter) {
    this.friend = friends[this.counter];
    this.counter++;
    return this.friend.gender === filter.gender ? this.friend : this.next();
}
function inviteCloseFriends(friends) {
    const friendName = sorted[this.level - 1][this.levelCounter];
    const friend = friends.find(friend => friend.name === friendName);
    this.counter++;
    this.levelCounter++;
    return friend;
}
function changeLevel() {
    this.levelCounter = 0;
    this.level++;
}
function Iterator(friends, filter) {
    this.counter = 0;
    this.level = 1;
    this.levelCounter = 0;
    this.done = () => false;
    this.next = () => {
        if (filter instanceof Filter == false) {
            throw new TypeError('filter is not instance of Filter');
        }
        else if (this.done() == true) {
            return null;
        }
        else if (isBest(friends[this.counter])) {
            return inviteBesties.call(this, friends, filter);
        }
        else if (isCloseFriend(friends[this.counter], this.level)) {
            const friend = inviteCloseFriends.call(this, friends, filter);
            this.done = () => isDone(friends, this.level, this.counter, this.limit);
            return friend.gender === filter.gender ? friend : this.next();
        }
        changeLevel.call(this);
        return this.next();
    };
}
Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);
Object.setPrototypeOf(LimitedIterator, Iterator);
function LimitedIterator(friends, filter, maxLevel) {
    this.limit = maxLevel;
    Iterator.call(this, friends, filter);
}
function Filter() {
    this.getGender = () => {
        return this.gender;
    };
}
function MaleFilter() {
    this.gender = 'male';
    Filter.call(this);
}
Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);
function FemaleFilter() {
    this.gender = 'female';
    Filter.call(this);
}
Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);
exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;
exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
