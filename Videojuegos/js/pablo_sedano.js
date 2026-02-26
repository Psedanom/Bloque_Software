/*
 * Example functions to practice JavaScript
 *
 * Pablo Sedano Morlett 
 * 2/25/2026
 */

"use strict";

// Returns the first non-repeating character in a string
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
        // If the character was not found in the candidates, it is added as a new candidate with count 1
        if (!found)
            candidates.push({ char: str[i], count: 1 });

    }
    // Goes through the candidates and returns the first that has a count of 1
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

//Inverts an array, accepts arrays of any type, returns a new array
function invertArray(arr) {
    let array = arr;
    if (array.length < 2)
        return array;

    // Due to it being a swap, we need to go only until the middle
    for (let i = 0; i < array.length / 2; i++) {
        [array[i], array[array.length - 1 - i]] = [array[array.length - 1 - i], array[i]];
    }

    return array;
}

//Inverts an array in place, accepts arrays of any type, modifies the original array
function invertArrayInplace(array) {
    if (array.length < 2)
        return array;

    // Due to it being a swap, we need to go only until the middle
    for (let i = 0; i < array.length / 2; i++) {
        [array[i], array[array.length - 1 - i]] = [array[array.length - 1 - i], array[i]];
    }

    return;
}

//Capitalizes the first letter of each word in a string
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

//Returns the greatest common divisor of two numbers using Euclid's algorithm
// It's really interesting give it a look :) https://www.inchcalculator.com/wp-content/uploads/2018/12/euclids-algorithm.png
function mcd(a, b) {
    if (b == 0) {
        return a
    }

    return mcd(b, a % b)
}

//Replaces certain characters in a string with numbers to make it look like "hacker speak"
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


//Returns an array with all the factors of a number
function factorize(num) {
    let factors = [];

    for (let i = 1; i <= num; i++) {
        if (num % i == 0) {
            factors.push(i);
        }
    }
    return factors
}

//Removes duplicates from an array, accepts arrays of any type
function deduplicate(arr) {
    let list = [];

    // Goes through the array and adds the element to the list if it is not already in it
    for (let i = 0; i < arr.length; i++) {
        if (!(list.includes(arr[i]))) {
            list.push(arr[i])
        }
    }
    return list
}

//Returns the length of the shortest string in an array of strings
function findShortestString(strArray) {
    if (strArray == "") {
        return 0
    }

    let shortest = strArray[0].length;

    // Goes through the array and updates the shortest variable if it finds a shorter string
    for (let i = 1; i < strArray.length; i++) {
        if (strArray[i].length < shortest) {
            shortest = strArray[i].length;
        }
    }
    return shortest
}

//Checks if a string is a palindrome
function isPalindrome(str) {
    if (str == "") {
        return true
    }
    let reverse = ""

    // Goes through the string in reverse order and adds each character to the reverse variable
    for (let i = str.length - 1; i >= 0; i--) {
        reverse += str[i]
    }

    // If the reverse string is the same as the original string, it is a palindrome
    if (reverse === str) {
        return true
    }
    else {
        return false
    }
}

//Sorts an array of strings in alphabetical order
function sortStrings(array) {

    // Checks for empty array
    if (array.length === 0) {
        return [];
    }

    if (array.length < 2) {
        return array
    }

    let arr = array;

    // Bubble sort to sort the array
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

//Returns an array with the average and the mode of an array of numbers
function stats(arr) {
    if (arr.length === 0) {
        return [0, 0]
    }
    let sum = 0;
    let numbers = new Map();
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];                                      // Sums all the numbers in the array to later calculate the average
        numbers.set(arr[i], (numbers.get(arr[i]) || 0) + 1) // The or is added for the first iteration so that it is not null
    }

    let mode_frec = 0;      // Stores the frequency of the most repeated number
    let mode_key = 0;       //Stores the key of the most repeated number


    // Checks every key in the map and updates the mode variables if it finds a more repeated number
    for (const x of numbers.keys()) {
        if (numbers.get(x) > mode_frec) {
            mode_key = x;
            mode_frec = numbers.get(x);

        }
    }
    // Returns an array with the average and the mode of the array
    return [(sum / arr.length), mode_key]


}

//Returns the most repeated string in an array of strings
function popularString(arr) {
    if (arr.length === 0) {
        return ""
    }

    let strings = new Map();
    for (let i = 0; i < arr.length; i++) {

        strings.set(arr[i], (strings.get(arr[i]) || 0) + 1) // The or is added for the first iteration so that it is not null
    }

    // Same logic as the mode part of the stats function but with strings instead of numbers
    let mode_frec = 0;
    let mode_key = 0;

    for (const x of strings.keys()) {
        if (strings.get(x) > mode_frec) {
            mode_key = x;
            mode_frec = strings.get(x);

        }
    }

    return mode_key


}


/*
Comment aside, this(power of two) was a very fun one to think about because you need to look at binary to understand it
every number that is power of 2 is a 1 followed by a series of zeroes like  10, 100, 1000 etc
and their previous number has all zeroes turned into 1, like  1, 11, 111
if we make a binary "AND" and the results is 0, then that means it was a number that started with a 1
and had all zeroes.

*/

//Checks if a number is a power of 2
function isPowerOf2(number) {

    // Checks for 0, which is not a power of 2
    if (number == 0) {
        return false
    }
    if ((number & (number - 1)) == 0) {
        return true
    }
    return false
}

//Sorts an array of numbers in descending order
function sortDescending(arr) {
    if (arr.length < 2) {
        return arr;
    }

    // Bubble sort to sort the array in descending order
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
