/*
 * Example functions to practice JavaScript
 *
 * Pablo Sedano Morlett
 * 2/25/2026
 */

"use strict";


function firstNonRepeating(str) {
    //Create empty array to store candidates
    const candidates = [];
    let found = false

    //check every character in the string
    for (let i = 0; i < str.length; i++) {
        //compare every character
        found = false
        for (let cand of candidates) {
            if (cand.char == str[i]) {
                cand.count += 1;
                found = true;
            }

        }
        if (!found)
            candidates.push({ char: str[i], count: 1 });

    }

    for (let index in candidates) {
        if (candidates[index].count == 1)
            return candidates[index].char;
    }

}


//Sorts an array using bubble sort, accepts arrays of numbers.
function bubbleSort(arr) {

    //flag checks if the array has been modified
    let flag = true;
    if (arr.length < 2) {
        return arr;
    }

    for (let j = 0; j < arr.length; j++) {

        for (let i = 1; i < (arr.length - j); i++) {

            if (arr[i - 1] > arr[i]) {

                let temp = arr[i];
                arr[i] = arr[i - 1];
                arr[i - 1] = temp;
                flag = false;        //tells us that the array has been changed so we need another iteration
            }
            
        }
        if (flag)               // if no changes happened the array is returned
            {

                return arr
            }
    }
    // returns function if it is done going through every iteration
    return arr
}

function invertArray(arr) {
    let array = arr;
    if (array.length < 2)
        return array;
    for (let i = 0; i < array.length / 2; i++) {
        [array[i], array[array.length - 1 - i]] = [array[array.length - 1 - i], array[i]];
    }

    return array;
}

function invertArrayInplace(array) {
    if (array.length < 2)
        return array;

    // array
    //array
    for (let i = 0; i < array.length / 2; i++) {
        [array[i], array[array.length - 1 - i]] = [array[array.length - 1 - i], array[i]];
    }

    return;
}

function capitalize(string) {

    // Checks for null String
    if (string == "") {
        return "";
    }

    // Creates the copy of the string to later modify it
    let str = string;

    // Capitalize first character
    str = str.charAt(0).toUpperCase() + str.slice(1);

    // Goes through every character starting from the second one
    for (let i = 1; i < string.length; i++) {

        // Checks if there is a space before the sentence
        //   and makes it uppercase
        if (str[i - 1] == " ") {
            str = str.slice(0, i) + str.charAt(i).toUpperCase() + str.slice(i + 1);
        }
    }


    return str;
}

function mcd(a, b) {
    if (b == 0) {
        return a
    }

    return mcd(b, a % b)
}

function hackerSpeak(str) {

    if (str == "") {
        return str;
    }

    // replaces all ocurrances lowercase and uppercase of the character
    str = str.replace(/a/gi, "4")
    str = str.replace(/e/gi, "3")
    str = str.replace(/i/gi, "1")
    str = str.replace(/o/gi, "0")
    str = str.replace(/s/gi, "5")
    return str
}

function factorize(num) {
    let factors = [];

    for (let i = 1; i <= num; i++) {
        if (num % i == 0) {
            factors.push(i);
        }
    }
    return factors
}

function deduplicate(arr) {
    let list = [];

    for (let i = 0; i < arr.length; i++) {
        if (!(list.includes(arr[i]))) {
            list.push(arr[i])
        }
    }
    return list
}


function findShortestString(strArray) {
    if (strArray == "") {
        return 0
    }

    let shortest = strArray[0].length;
    for (let i = 1; i < strArray.length; i++) {
        if (strArray[i].length < shortest) {
            shortest = strArray[i].length;
        }
    }
    return shortest
}

function isPalindrome(str) {
    if (str == "") {
        return true
    }
    let reverse = ""

    for (let i = str.length - 1; i >= 0; i--) {
        reverse += str[i]
    }

    if (reverse === str) {
        return true
    }
    else {
        return false
    }
}

function sortStrings(array) {
    if (array.length === 0) {
        return [];
    }

    if (array.length < 2) {
        return array
    }

    let arr = array;
    for (let j = 0; j < arr.length; j++) {
        let flag = true;
        for (let i = 1; i < (arr.length - j); i++) {
            if (arr[i - 1] > arr[i]) {
                let temp = arr[i];
                arr[i] = arr[i - 1];
                arr[i - 1] = temp;
                flag = false;
            }
        }
        if (flag) {

            return arr;
        }
    }

    return arr;

}

function stats(arr) {
    if (arr.length === 0) {
        return [0, 0]
    }
    let sum = 0;
    let numbers = new Map();
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        numbers.set(arr[i], (numbers.get(arr[i])|| 0) + 1) // The or is added for the first iteration so that it is not null
    }

    let mode_frec = 0;
    let mode_key = 0;

    for(const x of numbers.keys())
    {
        if(numbers.get(x)>mode_frec)
        {
            mode_key = x;
            mode_frec = numbers.get(x);
            
        }
    }
    
    return [(sum/arr.length),mode_key]


}

function popularString(arr) {
    if (arr.length === 0) {
        return ""
    }
    
    let strings = new Map();
    for (let i = 0; i < arr.length; i++) {
        
        strings.set(arr[i], (strings.get(arr[i])|| 0) + 1) // The or is added for the first iteration so that it is not null
    }

    let mode_frec = 0;
    let mode_key = 0;

    for(const x of strings.keys())
    {
        if(strings.get(x)>mode_frec)
        {
            mode_key = x;
            mode_frec = strings.get(x);
            
        }
    }
    
    return mode_key


}


/*Comment aside, this was a very fun one to think about because you need to look at binary to understand it

every number that is power of 2 is a 1 followed by a series of zeroes like  10, 100, 1000 etc
and their previous number has all zeroes turned into 1, like  1, 11, 111
if we make a binary "AND" and the results is 0, then that means it was a number that started with a 1
and had all zeroes.

*/
function isPowerOf2(number)
{
    if (number == 0)
        {
            return false
        } 
    if ((number & (number-1))==0)
    { 
        return true
    }
    return false
}

function sortDescending(arr) {
    if (arr.length < 2) {
        return arr;
    }

    for (let j = 0; j < arr.length - 1; j++) {
        let flag = true;

        for (let i = 1; i < arr.length - j; i++) {
            if (arr[i] > arr[i - 1]) {
                let temp = arr[i];
                arr[i] = arr[i - 1];
                arr[i - 1] = temp;
                flag = false;
            }
        }

        
        if (flag) {
            
            return arr;
        }
    }

    return arr;
}


export {
    firstNonRepeating,
    bubbleSort,
    invertArray,
    invertArrayInplace,
    capitalize,
    mcd,
    hackerSpeak,
    factorize,
    deduplicate,
    findShortestString,
    isPalindrome,
    sortStrings,
    stats,
    popularString,
    isPowerOf2,
    sortDescending, 
    
};
