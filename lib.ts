'use strict';

type Friends = {
	name: string,
	friends: string[],
	gender: 'male'|'female',
	best?: true
}

type Filter = {
	gender: 'male'|'female'
}

type SortedLevel = string[]
type Sorted = SortedLevel[];


type Constructor = {
	counter: number,
	level: number,
	limit: number,
	gender: Friends['gender'],
	levelCounter: number,
	friend: Friends,
	done: () => boolean,
	next: () => Constructor['friend']|null|Constructor['next'],
	getGender: ()=> string
}

const sorted:Sorted = [];

function sortUniqueNames(names:string[], prevNames:string[]):string[] {

	let result:string[] = [];

	names.forEach(name => {
		if (prevNames.indexOf(name) == -1) {
			result = result.length === 0 ? [name] : [...result, name];
		}
	});
	
	return Array.from(new Set(result));
}

function isBest(friend:Friends):boolean {

	if ('best' in friend) {

		sorted[0] = sorted[0] ?  [...sorted[0], ...friend.friends] : [...friend.friends];
		sorted[0] = Array.from(new Set(sorted[0].sort()));
		return true;
	}

	return false;
}

function isCloseFriend(friend:Friends, level:Constructor['level']):boolean {
	
	if (sorted[level - 1].includes(friend.name)) {

		sorted[level] = sorted[level] ? [...sorted[level], ...friend.friends] : [...friend.friends];
		sorted[level] = sortUniqueNames(sorted[level].sort(sortAlthabeticaly), sorted[level -1].sort(sortAlthabeticaly));

		return true;
	}
	return false;
}

function sortAlthabeticaly(a:string, b:string):number {

	const name:string = a.toLowerCase();
	const nextName:string = b.toLowerCase();

	if (name < nextName) {
		return -1;
	} else if (name > nextName) {
		return 1;
	}

	return 0;
}

function isDone(friends:Friends[], level:Constructor['level'], counter:Constructor['counter'], limit:Constructor['limit']):boolean {
	if (!sorted[level - 1] || level == limit || counter >= friends.length) {

		return true;
	} else if ( level + 1 == limit && isCloseFriend(friends[counter + 1], level) !== true) {

		return true;

	}

	return false;
}

function changeLevel(this:Constructor):void {
	this.levelCounter = 0;
	this.level++;
}

function Iterator(this:Constructor,friends:Friends[], filter:Filter):void {

	this.counter = 0;
	this.level = 1;
	this.levelCounter = 0;
	this.done = () => false;
	this.next = () => {


		if (filter instanceof Filter == false) {

			throw new TypeError('filter is not instance of Filter');

		} else if (this.done() == true) {

			return null;
		} else if (isBest(friends[this.counter])) {

			this.friend = friends[this.counter];
			this.counter++;

			return this.friend.gender === filter.gender ? this.friend : this.next();

		} else if (isCloseFriend(friends[this.counter], this.level)) {

			const friendName:Friends['name'] = sorted[this.level - 1][this.levelCounter];
			const friend:Constructor['friend'] = friends.find(friend => friend.name === friendName);

			this.counter++;
			this.levelCounter++;
			this.done = ():boolean => isDone(friends, this.level, this.counter, this.limit);

			return friend.gender === filter.gender ? friend : this.next();

		}

		changeLevel.call(this);

		return this.next();
	};
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);
Object.setPrototypeOf(LimitedIterator, Iterator);

function LimitedIterator(this:Constructor, friends:Friends[], filter:Filter, maxLevel:number):void {

	this.limit = maxLevel;
	Iterator.call(this, friends, filter);
}

function Filter(this:Constructor):void {
	this.getGender = () => {
		return this.gender;
	};
}

function MaleFilter(this:Constructor):void {
	this.gender = 'male';
	Filter.call(this);
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

function FemaleFilter(this:Constructor):void {
	this.gender = 'female';
	Filter.call(this);
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);


module.exports = {
	Iterator,
	LimitedIterator,
	Filter,
	MaleFilter, 
	FemaleFilter
};