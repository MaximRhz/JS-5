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

let sorted = [];

function sortUniqueNames(names:string[], prevNames:string[]):string[] {

	const result = []	
	names.forEach(name => {
		if (prevNames.indexOf(name) == -1) {
		  result.push(name);
		}
	  });
	
	return Array.from(new Set(result));
}

function isBest(friend:Friends):boolean {
	if (friend.hasOwnProperty('best')) {

		sorted[0] = sorted[0] ?  [...sorted[0], ...friend.friends] : [...friend.friends];
		sorted[0] = Array.from(new Set(sorted[0].sort()));
		return true;
	}
	return false;
}

function isCloseFriend(friend:Friends, level:number):boolean {
	
	if (sorted[level - 1].includes(friend.name)) {

		sorted[level] = sorted[level] ? [...sorted[level], ...friend.friends] : [...friend.friends];
		sorted[level] = sortUniqueNames(sorted[level].sort(), sorted[level -1].sort());

		return true;
	}
		return false;
}

function sortAlthabeticaly(a, b):number {
	const name = a.name.toLowerCase();
	const nextName = b.name.toLowerCase();

	if (name < nextName) {
		return -1;
	} else if (name > nextName) {
		return 1;
	}

	return 0;
}

function sortFriends(friends:Friends[]):Friends[] {

	const besties:Friends[] = friends.filter(friend => friend.hasOwnProperty('best'));
	const others:Friends[] = friends.filter(friend => {
		if (friend.hasOwnProperty('best')) {
			return false
		} else return true;
		
});
	const sortedFriends:Friends[] = others.sort(sortAlthabeticaly);

	return [...besties, ...sortedFriends]
}

function findFriend(friends:Friends[], name:string) {

	const foundFriend = friends.filter(friend => {
		return friend.name = name;
	})
	return foundFriend[0];
}

function Iterator(friends:Friends[], filter:Filter):void {

	this.counter = 0;
	this.level = 1;
	this.value = '';
	this.gender = '';
	this.levelCounter = 0;
	this.done = () => false;

	this.next = () => {


		if (this.counter < friends.length && isBest(friends[this.counter])) {

			this.value = friends[this.counter];
			this.gender = friends[this.counter].gender;
			this.counter++;

			if (this.gender === filter.gender) {

				return this.value;
			}


			return this.next();

		} else if (this.counter < friends.length) {

			if (!sorted[this.level - 1]) {
				return this.done();
			} else if  (isCloseFriend(friends[this.counter], this.level) && this.level !== this.limit ){
				
				const friendName = sorted[this.level - 1][this.levelCounter];
				const friend = friends.find(friend => friend.name === friendName);
				this.value = friend;
				this.gender = friend.gender
				this.counter++;
				this.levelCounter++;

				if (this.gender === filter.gender) {

					if ( this.level + 1 == this.limit && isCloseFriend(friends[this.counter + 1], this.level) !== true) {

						this.done = () => true;
						return this.value;
					} else if (this.counter >= friends.length) {
						this.done = () => true;
						return this.value;
					}
					return this.value;
				}


				return this.next()
			}

			this.levelCounter = 0;
			this.level++;

			return this.next();
		}
		return null;
	}	
}
Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);
Object.setPrototypeOf(LimitedIterator, Iterator);

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends:Friends[], filter:Filter, maxLevel:number):void {

	this.limit = maxLevel;
	Iterator.call(this, friends, filter);
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter():void {
	this.gender = '';
}

Object.setPrototypeOf(Filter, Iterator);

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter():void {
	this.gender = 'male';
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter():void {
	this.gender = 'female';
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
