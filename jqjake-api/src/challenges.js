/*
List of fields:

challengeIntroduction
challengeJson
challengeAnswer
challengeIsFirst
challengeIsLast
challengeInstruction
challengeIndentOverride,
challengeInstructionJson
challengeAnswerOptions

*/

const challengesWithoutId = [
    {
        challengeIntroduction: "Introduction to jq",
        challengeIsFirst: true,
        challengeJson: { messageFrom: "The Boss", messageContent: "Let's steal some art!" },
        challengeAnswer: ".",
        challengeInstruction:
            "<div class='instruction-content'><n><p/>jq is a cross platform command line utility for processing and manipulating JSON. This site is designed to teach you jq through a series of interactive challenges.</n><p/>Meet Jake. Jake is a world renowned detective.<p/>Jake is investigating an art heist from the local museum. The thieves have clumsily left behind a series of clues in JSON format and Jake needs your help to make sense of them. Good thing you have jq in your toolkit!</p><p>jq is a popular command line utility for processing and transforming JSON. A typical jq command can be broken up into three parts:<ul><li/><b>Options</b>. As the term suggests these, are, well, optional. We'll get to these a little later on, but for now it's useful to know options are primarily used to provide special instructions related to the structure and format of the input and output.<li/><b>The filter.</b> The source of much of jq's power and where we'll be focusing the majority of our efforts. The filter provides capabilities to transform and manipulate the input to achieve the desired result. The simplest filter is a single period, formally known as the identity operator. A lone period will do nothing more than pretty-print the input JSON to the output stream. Helpfully, this can also be used as a way to confirm that the input is valid JSON.<li/><b>Input JSON.</b> In practice this would either come from a file or from the piped output stream of another program like curl or cat, but here we'll display the input in a box with the same label.</ul><h><p/>Jake has discovered a trove of files on a drive the heisters have accidentally left behind that appear to be in JSON format.<p/>Confirm the first file is valid JSON by entering a single period into the filter.<p/>Your goal is to match the actual output to the target output. Once you've completed the challenge, click <b>NEXT</b> to advance to the next challenge. If at any point you get stuck, click the <b>Show Answer</b> button to reveal the answer.</h></div>",
        challengeIndentOverride: 0,
    },

    {
        challengeIntroduction: "Retrieving values from key-value pairs",
        challengeJson: {
            heistTarget: "National Museum of Interesting Art",
            heistDate: "One week from today",
            heistPeopleRequired: 6,
            heistHasBigReward: true,
            heistSecretPasscode: "super-secure-1234",
        },
        challengeAnswer: ".heistSecretPasscode",
        challengeInstruction:
            "<div class='instruction-content'><p/>Now that we've confirmed we're working with valid JSON, let's start building a more complex filter. Take a look at the JSON below.#0#<p/>As a quick JSON refresher:</p><ul><li/>Objects are enclosed by braces. In this example the complete piece represents one object.<li/>The example object has two keys, <b>personId</b> and <b>personFirstName</b>. The keys are enclosed by double quotes and from their names we can infer their purpose.<li/>Each key has a corresponding value. In this case the values are an integer, <b>10</b>, and a string, <b>\"Suzy\"</b>, respectively, however it's also possible that in addition to basic primitives like numbers, strings, and booleans, values can contain arrays or nested objects.</ul><w>jq is case sensitive. <b>FIRSTNAME</b>, <b>firstName</b>, and <b>firstname</b> are all different and cannot be used interchangeably.</w>To retrieve the value for a specific key, enter the key's name preceded by a period. Using the above example a filter of <c>.personFirstName</c> will output <o>\"Suzy\"</o>, quotes included.</p></p><h><p>Jake needs the secret passcode to decrypt the remaining JSON files.<p/>Retrieve the value of the <b>heistSecretPasscode</b> key.</p></h></div>",
        challengeInstructionJson: [{ output: { personId: 10, personFirstName: "Suzy" } }],
    },

    {
        challengeIntroduction: "Retrieving values from nested objects",
        challengeJson: {
            heistTarget: "National Museum of Interesting Art",
            schemers: { plannedBy: "Mel the Mastermind", ringleader: "Bob the Boss" },
        },
        challengeAnswer: ".schemers.plannedBy",
        challengeInstruction:
            "<div class='instruction-content'><p/>Good job retrieving the secret passcode!<p />Often JSON will contain nested objects as a way to group logically related fields together.#0#<p/>In this example <b>personId</b> and <b>personName</b> are sibling fields at the same level. <b>personName</b> has a child object with two fields, <b>firstName</b> and <b>preferredName</b>. Nesting is a common design practice to avoid unnecessary repetition of fields.<p/>In jq we can retrieve the value from a child by chaining it to the parent. Filtering for <c>.personName.preferredName</c> will output <o>\"Suzy\"</o>.<h><p/>Let's see who you're up against. <p/>Find out who planned the heist by retrieving the value for <b>plannedBy</b>, which is a child of <b>schemers</b>.</h></div>",
        challengeInstructionJson: [
            {
                output: {
                    personId: 10,
                    personName: { firstName: "Suzanne", preferredName: "Suzy" },
                },
            },
        ],
    },

    {
        challengeIntroduction: "Object construction",
        challengeJson: {
            heistTarget: "National Museum of Interesting Art",
            managedBy: "Bob the Boss",
            plannedBy: "Mel the Mastermind",
            henchPeopleRequired: 3,
            primaryObjective: "The world famous Pony Risa",
        },
        challengeAnswer: '{"request_id": 1, "requested_by": "Jake", "schemer_name": .plannedBy}',
        challengeInstruction:
            "<div class='instruction-content'><p/>As developers we often need to work with public API's that output JSON in formats that may not work well for our own purposes. In these situations jq can transform the JSON into a structure that more closely meets our needs.<p />#0#Take the above JSON, for example. We can work with the JSON as-is if needed, but it would be easier if it were to meet the following criteria:<p/><ul><li/>Only included the <b>personId</b> field. <b>firstName</b> is not needed.<li/>Instead of <b>personId</b>, it used its snake case equivalent, <b>person_id</b>.<li/>In addition to the one field from the originating JSON, a second hard-coded field indicating its type were included.</ul><p/>Constructing an object that meets these requirements is relatively straightforward. Start by structuring the desired object in the filter, leaving the values blank to start.<ul><li/>If the value should come from the originating JSON, the value will be the key from the JSON preceded by a period, just as we saw in the prior challenges.<li/>If the value should be hard-coded, enter what you'd like to see in the output. It's important that if your value is a string, it will need to be enclosed in quotes. For values that are numbers, booleans, or null, omit the quotes, unless you'd like them to be evaluated as strings.</ul><p/> A filter of <c>{person_id: .personId, type: \"person\"}</c>will satisfy the three criteria, as demonstrated below.#1#<p/>Note that in the filter the <b>person_id</b> and <b>type</b> key names are not enclosed in quotes. You can surround them in quotes and it'll still work, but doing so is optional. Regardless, the output will included quoted key names in accordance with JSON rules.<p/>We've effectively created a new object using a combination of values from our originating JSON in addition to new hard-coded values. We'll expand on this in subsequent challenges.<h><p/>Jake needs to pull background information on the heist's planner.<p/>Construct an object for the Crime Analyzer 3000 with the following three keys, in order:<ol><li/><b>request_id</b>, which should contain a numeric hard-coded value of 1.<li/><b>requested_by</b>, which should contain a hard coded-value of Jake.<li/><b>schemer_name</b>, which should take the value from <b>plannedBy</b> in the input JSON.</ol></h></div>",

        challengeInstructionJson: [
            {
                output: {
                    personId: 10,
                    firstName: "Suzanne",
                },
            },

            { output: { person_id: 10, type: "person" } },
        ],
    },

    {
        challengeIntroduction: "Introduction to arrays",
        challengeJson: {
            henchPeople: [
                { personName: "Burglar Barry", personRole: "General purpose burgling" },
                { personName: "Safecracking Sue", personRole: "Crack any safes encountered" },
            ],
        },
        challengeAnswer: ".[]",
        challengeInstruction:
            "<div class='instruction-content'><p/>An array is a set of zero, one, or more elements. An array of primitive integers with three elements might look like <o>[1,5,6]</o>. In addition to primitives, arrays can also contain objects and nested arrays. Let's review a more complex example. #0# <p/><ul><li/>Arrays are enclosed by square brackets. There are three arrays in this example. The first is an outer array comprised of two objects, the other two are arrays of trades within each object.<li/>Elements in the array are separated by a comma. Valid JSON can contain zero elements, represented by an empty set of brackets, or a single element without any commas. Note that in the example the arrays are not of the same length (i.e., they have a different number of elements). That's perfectly valid.<li/>Similar to object values, elements within an array can be of any type, including number, string, boolean, null, an object, or even a nested array.<li/>An array can contain a mix of types.</ul><p/>Complete arrays as in the above example can be referenced with a single period, though typically we wouldn't expect to see an array at the root level. More commonly we might see JSON like the one shown below, where the root is an object with two keys, <b>clients</b> and <b>trades</b>.#1#<p/>The complete <b>clients</b> array could be returned with a filter of <c>.clients</c>. Similarly, the <b>trades</b> array could be return with a filter of <c>.trades</c>.<p/>Future challenges will cover working with elements within an array. <h><p/>Looks like we've got some names our first set of warrants.<p/>Return the complete <b>henchPeople</b> array.</h></div>",

        challengeInstructionJson: [
            {
                output: [
                    { clientId: 1, tradeId: [1000, 1001, 1008, 1009] },
                    { clientId: 2, tradeId: [1002, 1003, 1004] },
                ],
            },
            {
                output: {
                    clients: [
                        { clientId: 1, clientName: "Amy" },
                        { clientId: 2, clientName: "Ben" },
                    ],
                    trades: [
                        { tradeId: 1000, clientId: 1 },
                        { tradeId: 1004, clientId: 2 },
                    ],
                },
            },
        ],
    },

    {
        challengeIntroduction: "Accessing array elements by index",
        challengeJson: {
            toolsRequired: ["flashlight", "Art for Dummies 101 book", "midnight snack", "wire cutters", "ladder"],
        },
        challengeAnswer: ".toolsRequired[2:4]",
        challengeInstruction:
            '<div class=\'instruction-content\'><p/>In the previous challenge you learned how to return an array in its entirety, but there may be situations where you only want a single element or a range based on index.</p>#0#As we\'ve seen <c>.fruits</c> will return the entire array. We can specify an index or a range by adding a set of brackets to the filter, <c>.fruits[]</c>. Technically this functions as an iterator, instructing jq to loop through the array. The entire array will be returned if no index or range is supplied, though there are some important distinctions that we\'ll get into shortly.<p/><ul><li/>A single element can be returned by specifying the index position. <c>.fruits[1]</c> will return <o>"grape"</o>. <b>Arrays are zero-indexed, hence 1 will return the second item in the array.</b><li/>A range can be selected by specifying the starting and ending position separated by a colon. <c>.fruits[1:3]</c> will return <o>["grape","kiwi"]</o><li/>Open ended ranges can be used by omitting the starting or ending index position. <c>.fruits[:2]</c> will include everything up to the second position in the index, <o>["apple","grape"]</o>. <c>.fruits[2:]</c> will include the second position and everything that follows, <o>["kiwi","peach"]</o>.<li/><b>When ranges are used the starting position is inclusive, meaning the value in the specific position will be included. The ending position, however, is exclusive. It includes positions up to, but not including the position specified.</b><li/>Negative index positions can be specified to start from the end of the array instead of the beginning. <c>.fruits[-1]</c> will return the last item in the array, <o>"peach"</o>. <c>.fruits[-3:-1]</c> will return items starting from third to last, ending from second to last in the array, <o>["grape","kiwi"]</o>. Note that even though both examples include -1, only one includes peach as part of the result. Because ending values in ranges are exclusive, -1 behaves differently when used alone vs. when used as the ending value in the range.</ul><h><p/>Jake needs to get a closer look at the tools used in the heist, but for now he doesn\'t need the complete list.<p/>Return the elements that are in the third and fourth index position from the <b>toolsRequired</b> array.<p/><b>HINT</b>: Remember that arrays are zero-indexed.</h></div>',

        challengeInstructionJson: [{ output: { fruits: ["apple", "grape", "kiwi", "peach"] } }],
    },

    {
        challengeIntroduction: "Array construction",
        challengeJson: {
            managedBy: "Bob the Boss",
            plannedBy: "Mel the Mastermind",
            primaryBurglar: "Burglar Barry",
        },
        challengeAnswer: "[.managedBy, .plannedBy]",
        challengeInstruction:
            "<div class='instruction-content'><w>This challenge introduces concepts that are key to understanding the jq model. Make sure you understand array construction before proceeding.</w><p/>Array construction at first glance is not too dissimilar from object construction. Take the following JSON:#0#<p/>An array with a combination of hard-coded and dynamic values can be constructed using a filter of <c>[\"first\", 2, .fruits[0]]</c>, which returns an array with three elements, <o>[\"first\", 2, \"apple\"]</o>.The first two elements are a hard-coded string and number, respectively, while the third element comes from the source JSON. Simple enough, right?<p/>Let's take a careful look at the output of <c>.fruits[]</c>. #1# <p/>Notice anything peculiar? It's not valid JSON! It's three values on their own. There's no comma separating the values and it's not wrapped in brackets.<p/>Compare that to the similar looking <c>[.fruits[]]</c> and <c>.fruits</c>, which in this case both return an array, albeit for different reasons.#2#<p/><ul><li/><c>.fruits[]</c> will return a list of elements, but only for an array. Any other type will return an error. As we learned in the last challenge this is instructing jq to iterate over the elements within the array. This is not particularly useful just yet, but will be once functions and pipes are introduced.<li/><c>[.fruits[]]</c> is similar in that it returns a list of elements, but critically by wrapping it in brackets jq will return the separate elements as an array. The outer brackets in this filter are constructing an array, the only instance across the three filters where that's done. Wrapping a filter component in a set of brackets will cause jq to construct and return an array.<li/><c>.fruits</c> returns an array as well, but only because the value of fruits is an object. This is largely passing through the input type, such that if fruits were instead an object, the output type would also be an object.</ul><p>To make this even more complicated, let's quickly revisit accessing arrays by index from the prior challenge.<ul><li/> <c>.fruits[]</c> does not return an array. Output includes all three fruits. However, it can be coerced into an array by wrapping it in brackets, like <c>[.fruits[]]</c>.<li/><c>.fruits[0:3]</c> returns the same three fruits as the preceding filter, but as an array.<li/> <c>.fruits[0]</c> does not return an array. Output includes only the first fruit. Wrapping the filter in brackets will return an array with a single value.<li/> <c>.fruits[0:1]</c> returns the same first fruit as the preceding filter, but as an array. Remember the ending position is not inclusive, so in terms of how many values to return, 0:1 is effectively the same as 0 alone, but only the latter will return an array!</ul></p><p/>All of which is a long-winded way to say when working with arrays it's important to remember that subtle differences can impact the return type.<h><p/>Jake has an object with several important names. He needs to review the names with Ian the Artificial Investigator, but Ian only accepts arrays.<p/>Construct an array that meets the following conditions:<ul><li/>The array should have two elements.<li/>The first element should be the value from the <b>managedBy</b> key.<li/>The second element should be the value from the <b>plannedBy</b> key.</ul></h></div>",

        challengeInstructionJson: [
            { output: { fruits: ["apple", "grape", "kiwi"] } },
            { formatAsPlainText: true, output: '"apple"<br/>"grape"<br/>"kiwi"' },
            { output: ["apple", "grape", "kiwi"] },
        ],
    },

    {
        challengeIntroduction: "Construction checkpoint",
        challengeJson: {
            henchPeople: [
                { personName: "Lou the Locksmith", primarySkill: "opening doors" },
                { personName: "Lookout Larry", primarySkill: "being stealthy" },
            ],
        },
        challengeAnswer: '[{command: "LOOKUP", suspect: .henchPeople[].personName}]',
        challengeInstruction:
            "<div class='instruction-content'><p/>Optional checkpoint designed to test your basic understanding of array and object construction.<h><p/>Jake needs to look up possible aliases using the Alias-O-Matic. Annoyingly it requires a specialized format.<p/>Construct an array of objects that meets the following conditions:<ul><li/>The array should have as many objects as there are elements in the <b>henchPeople</b> array (i.e., to iterate over the array your filter should probably include <c>.henchPeople[]</c> somewhere in it).<li/>Each object should have two keys, <b>command</b> and <b>suspect</b>, in that order.<li/>The <b>command</b> key should have a hard-coded value of <b>LOOKUP</b>.<li/>The <b>suspect</b> key should take its value from the input <b>personName</b> value.</ul></h></div>",
    },

    {
        challengeIntroduction: "Adding and modifying keys for existing objects",
        challengeJson: {
            photographs: [
                { photographName: "Silent Symphony", yearPhotographed: 1960, location: "South wing" },
                { photographName: "Bridge Over Ocean", yearPhotographed: 1995, location: "Second floor parlor" },
            ],
        },
        challengeAnswer: '.photographs[].location = "MISSING"',
        challengeInstruction:
            '<div class=\'instruction-content\'><p/>Earlier challenges provided an approach for adding keys using object construction.#0#<p/>We can add a new key by fully reconstructing the existing object along with the new key and value. That works, but constructing a complete object may be painful for large objects, like those with tens or more keys.<p/>jq provides a shortcut. A new key can be added by providing a name along with its definition. The following filter will add a new <b>fruitIsEdible</b> key:<br/><c>.fruitIsEdible = true<c/><p/>Which is considerably easier but otherwise functionally equivalent to constructing a replacement object:<br/><c>{fruitName: .fruitName, fruitShape: .fruitShape, fruitIsEdible: true}</c><p/>The output for both will be the same:#1#<p/>Modifying an existing key can be done in the exact manner. If the key exists, the value will be updated. If the key does not exist, it will be added. That is, for an object that already has a <b>fruitIsEdible</b> key, a filter of <c>.fruitIsEdible = "Yes, except the core"</c> will produce:#2#<p/>This technique can extended to be used with objects within array. For example, given the following array:#3#<p/>A key can be added by using an iterator to loop through each object. <c>.[].isTasty = true</c> will return the original array along with the a new key, <b>isTasty</b>.#4#<h><p/>The thieves made a copy of some internal catalog data that includes the location of a couple of photographs that were stolen.<p/><b>photographs</b> includes an array of objects. Update the value for the <b>location</b> key to <b>"MISSING"</b>.</h></div>',
        challengeInstructionJson: [
            {
                output: { fruitName: "apple", fruitShape: "round" },
            },
            {
                output: { fruitName: "apple", fruitShape: "round", fruitIsEdible: true },
            },
            {
                output: { fruitName: "apple", fruitShape: "round", fruitIsEdible: "Yes, except the core" },
            },
            {
                output: [{ fruitName: "apple" }, { fruitName: "pear" }],
            },
            {
                output: [
                    { fruitName: "apple", isTasty: true },
                    { fruitName: "pear", isTasty: true },
                ],
            },
        ],
    },

    {
        challengeIntroduction: "Pipe redirection",
        challengeJson: {
            alarmCombination: [
                {
                    sequence: 1,
                    digit: 0,
                },
                {
                    sequence: 1,
                    digit: 6,
                },
                {
                    sequence: 3,
                    digit: 4,
                },
            ],
        },

        challengeAnswer: "[.alarmCombination[] | .digit | tostring]",
        challengeInstruction:
            "<div class='instruction-content'><p/><w>Pipes are fundamental to jq and will be heavily used from this point forward. Make sure you understand this section before proceeding.</w><p/>Pipes can be used to redirect the output of a filter component to another operation for further manipulation. Pipes provide a mechanism in which multiple commands can be chained together within a single filter. Conceptually this is similar to how Unix-like programs can pass output to one another. This will be especially useful once functions are introduced, but let's take an independent look before then. Take the following JSON.<p/>#0#This is a simple array of two objects, similar to what we've seen in previous challenges. If we wanted to construct new objects with both of the keys, how would we do that? You might try starting with the same technique that was previously used, extending it to second key:<br/><c>[{newKey1: .[].personId, newKey2: .[].personName}]</c>. But that won't work. That returns:<p/>#1#<p/>The original JSON included two objects, but the filter returns four! That's probably not what you want. To understand how we end up with four objects, let's take a closer look at what the filter is doing.<p/>Stripping away the pieces related to construction reveals a filter where it's easier to see what's going on, <c>.[].personId, .[].personName</c>. Critically, two sets of brackets tells us the array is being iterated over twice. The first time the output is limited to <b>personId</b>, then the second time the output is limited to <b>personName</b>.<p/>#2#<p/>Combining the two into a single object effectively acts as a cartesian join. Adding a third object to the array would return nine records, four objects would return 16, and so on.<p/>The pipe allows us to redirect on an element-level basis the output of one filter as the input to a second filter. Practically speaking, for this example we can write a filter to iterate over each object in the array, redirecting the element to a second array for construction.<br/><c>[.[] | {newKey3:.personId, newKey4:.personName}]</c> returns:#3#<p/>Note that the array is only iterated over once. The input for the second filter is no longer an array, rather it's an object that can be directly addressed by key.<p/>To demonstrate usage of pipes ina different manner, take the following JSON: #4#<p/>As we've seen above we can return an array of values from the quantity field with <c>[.[] | .quantity]</c>. The original JSON includes numbers stored as strings, which won't allow us to perform math operations like multiplication. To perform multiplication we need to first convert the string to a number, which we can do with the tonumber function.<p/><c>[.[] | .quantity | tonumber]</c><p/>This is similar to the preceding filter, except this version additionally redirects the output of the quantity key to the tonumber function for type conversion. The output can redirected to as many functions as needed.<h><p/>Somehow the heisters have gotten their hands on the alarm combination. Jake needs to verify the code with the alarm company to determine how it was compromised. Because the combination starts with a leading zero, Jake wants to convert it to a string to prevent it from being accidentally dropped.<p/>Construct an array that meets the following criteria:<ul><li/>The array contains as many elements as there are in the objects in the <b>alarmCombination</b> array.<li/>The value should be taken from the <b>digit</b> key.<li/>The <b>digit</b> value should be converted from a number to a string. This can be done by piping it to the <c>tostring</c> function.</ul></h></div>",

        challengeInstructionJson: [
            {
                output: [
                    { personId: 1, personName: "Burt" },
                    { personId: 2, personName: "Tina" },
                ],
            },

            {
                output: [
                    { newKey1: 1, newKey2: "Burt" },
                    { newKey1: 1, newKey2: "Tina" },
                    { newKey1: 2, newKey2: "Burt" },
                    { newKey1: 2, newKey2: "Tina" },
                ],
            },
            { formatAsPlainText: true, output: '1<br/>2<br/>"Burt"<br/>"Tina"' },
            {
                output: [
                    { newKey3: 1, newKey4: "Burt" },
                    { newKey3: 2, newKey4: "Tina" },
                ],
            },

            {
                output: [
                    { name: "apple", quantity: "3" },
                    { name: "kiwi", quantity: "5" },
                ],
            },
        ],
    },

    {
        challengeIntroduction: "Pipe redirection advanced challenge",
        challengeJson: {
            targets: [
                {
                    targetId: 1,
                    pieceName: "Ode to Nature",
                    appraisal: { date: "June", amount: "$14.2M" },
                },
                {
                    targetId: 2,
                    pieceName: "Tapestry of Duality",
                    appraisal: { date: "July", amount: "$21.0M" },
                },
            ],
        },

        challengeAnswer: "[.targets[] | {artwork: .pieceName, worth:.appraisal.amount }]",
        challengeInstruction:
            "<div class='instruction-content'><p/>Optional additional challenge to test your understanding of pipes.<h><p/>Two pieces of art were specifically targeted. Jake needs to put a statement together for insurance purposes.<p/>Construct an array that meets the following criteria:<ul><li/>The array should have as many objects as there are elements in the <b>targets</b> array (i.e., your filter should probably include <c>.targets[]</c> somewhere in it).<li/>Each object should contain two keys, <b>artwork</b> and <b>worth</b>, in that order.<li/>The value for <b>artwork</b> should be taken from the <b>pieceName</b> key.<li/>The value for <b>worth</b> should be taken from <b>amount</b> key, which is a child of <b>appraisal</b>.</ul></h></div>",
    },

    {
        challengeIntroduction: "Elementary arithmetic operations",
        challengeJson: {
            targetPiece: "Eclipse of Eternity",
            buyerLinedUp: true,
            saleAmount: 200000,
            splitWays: 5,
            brokerFee: 0.2,
        },

        challengeAnswer: "(.saleAmount * (1 - .brokerFee)) / .splitWays",
        challengeInstruction:
            '<div class=\'instruction-content\'><p />Simple mathematical operations like addition, subtraction, multiplication, and division can be easily handled via programming languages or database queries, but there may be situations where it\'s easier if the data is updated directly within the JSON. For these situations jq supports elementary operations.<p/>Given the following JSON:#0#<p/>An arbitrary value can be added to x by specifying the value directly within the filter. For example, <b>5</b> can be added to <b>x</b> with <c>.x + 5</c>, the result of which is 10 + 5 = <o>15</o>.<p/>Values can be added together using a similar syntax. <c>.x + .y</c> returns 10 + 2 = <o>12</o>.<w>jq is type sensitive. A value may look numeric, but jq will treat it as a string if it\'s enclosed in double quotes. The tonumber function will coerce strings to numbers, but this should be used with caution as an error will be returned if there are values that cannot be coerced.</w><p/>The following operators are available:<ul><li/>Addition: +<li/>Subtraction: -<li/>Multiplication: *<li/>Division: /<li/>Modulo: %</ul><p/>Order of operations can be specified using parenthesis.<p/> <h><p/>The thieves are targeting a specific piece and have already lined up a buyer. Jake needs to know how much each thief will earn so that he can notify local banks to look for deposits in that amount.<p/>Eclipse of Eternity will sell for $200,000, less a 20% commission for the broker that lined up the illegal sale. The post-commission net will then be split five ways.<p/>Figure out how much each thief will walk away with.<p/><p/><b>HINT:</b> the formula is [Target Price] * (1 - [Broker Fee]) / [Split Number of Ways].</h></div>',

        challengeInstructionJson: [
            {
                output: { x: 10, y: 2 },
            },
        ],
    },

    {
        challengeIntroduction: "Operating on arrays with map",
        challengeJson: {
            location: "Great Hall",
            securitySystem: "motion detector",
            flaw: "blind spot identified",
            dimensions: [40.6, 120.2, 18.8],
        },
        challengeAnswer: ".dimensions | map (. | round)",
        challengeInstruction:
            "<div class='instruction-content'><p/>The map function makes working with arrays easier in some situations by providing an alternate simplified syntax. Map will iterate on every element within an array and, importantly, will return an array.<p/>Take the following JSON:#0#<p/>If we wanted to return an array with the total, calculated as price multiplied by quantity, the following filter could be used:<p/><c>[.[] | .price * .quantity]</c><p/>This works, but it can be slightly difficult to follow. Iterate over the array, pipe that to a formula, and then wrap all of that in a set of brackets in order to return an array.<p/>An equivalent filter using the map function may be easier to read.<p/><c>map(.price * .quantity)</c><p/>The benefits of using map are especially apparent when writing lengthier filters that combine multiple functions. Functionally the two filters are equivalent. Simplified, the following are interchangeable:<p/><c>[.[] | .price * 2]</c> = <c>map(.price * 2)</c><h><p/>Apparently there's a blind spot in the motion detecting security system. To find the flaw Jake needs to draw an approximate map of the room.<p/>The <b>dimensions</b> array contains the length, width, and height of the room to one decimal point. Iterate over each of the values in the array using the map function and return the rounded dimension.<p/><b>HINT</b>: Round the values by piping them to the <b>round</b> function, as in <c>(. | round)</c>. You'll also need to pipe the array from <b>dimensions</b> to the map function.</h></div>",

        challengeInstructionJson: [
            {
                output: [
                    { price: 2, quantity: 3 },
                    { price: 4, quantity: 2 },
                ],
            },
            {
                output: [
                    { key1: "first", key2: "pear" },
                    { key1: "second", key2: "200" },
                ],
            },
        ],
    },

    {
        challengeIntroduction: "Conditional reduction with select",
        challengeJson: [
            { sculptureName: "Festive Farmer", sculptureAge: 450 },
            { sculptureName: "Merry Medusa", sculptureAge: 2200 },
            { sculptureName: "Grumpy Grandmaster", sculptureAge: 120 },
            { sculptureName: "Renaissance Lady", sculptureAge: 700 },
        ],

        challengeAnswer: "map(select(.sculptureAge > 500))",
        challengeInstruction:
            '<div class=\'instruction-content\'><p/>The select function can be used to conditionally test values within an array. Values not passing the boolean expression are excluded from the output. Compared to its SQL counterparts, jq select is similar to a where clause in SQL.<p/>Take the following array:#0# <p/>Using select we can test values using several conditional operators. For example:<ul><li/><c>map(select(. == 4))</c> will return <o>[4]</o> because <b>4</b> is one of the values in the array.<li/><c>map(select(. >= 5))</c> will return <o>[5,8]</o> because those values are greater than or equal to <b>5</b>.<li/><c>map(select(. % 4 == 0))</c> will return <o>[4,8]</o> because those values will have no remainder when divided by <b>4</b> (as covered in the introduction to basic arithmetic operators, the percent sign is the modulo operator).<li/><c>map(select(. == 0))</c> will return an empty array because no values satisfy the condition.</ul><p/><w>Font ligatures used by this site may make code within this challenge confusing to follow. For clarity: <ul><li/><c>==</c> is two consecutively typed equals signs.<li/><c>>=</c> is a greater than key followed by an equals sign.<li/><c>!=</c> is an exclamation point followed by an equals sign.</ul></w><p/>The select function can be extended to complex arrays, including those comprised of objects. Let\'s take a look at an example. #1#<p/><ul><li/><c>map(select(.fruitId == 1))</c> returns an array with one object, <o>[{"fruitId": 1, "fruitName": "pear"}]</o>, because the value of <b>fruitId</b> in one of the objects is equal to <b>1</b>.<li/><c>map(select(.fruitId != 3))</c> returns the complete array because the value of <b>fruitId</b> for every object within the array  is not equal to <b>3</b>.<li/><c>map(select(.fruitId == 1)) | .[].fruitName</c> will return <o>"pear"</o> because the output of the matching object is piped to a secondary instruction which only returns the value for <b>fruitName</b>.<li/><c>map(select(.fruitId != 1)) | [.[].fruitName]</c> will return <o>["kiwi"]</o> because the output of the matching object is piped to a secondary instruction which only returns the value for <b>fruitName</b> and wraps it in an array constructor.</ul>  <h><p/>The thieves have targeted several sculptures. Jake needs to notify the National Register of Old Timey Sculptures if pieces older than 500 years has been stolen.<p/>Return all objects from the input array where the <b>sculptureAge</b> is greater than <b>500</b>.</h></div>',
        challengeInstructionJson: [
            {
                output: [1, 4, 5, 8],
            },
            {
                output: [
                    { fruitId: 1, fruitName: "pear" },
                    { fruitId: 2, fruitName: "kiwi" },
                ],
            },
        ],
    },

    {
        challengeIntroduction: "Conditional reduction with select advanced challenge",
        challengeJson: {
            safehouses: [
                { safeHouseId: 1, use: false, address: "220 Shadow Alley" },
                { safeHouseId: 2, use: true, address: "125 Hideaway Heights" },
                { safeHouseId: 3, use: false, address: "310 Bandit Boulevard" },
            ],
        },
        challengeAnswer: ".[] | map(select(.use == true)) | .[].address",
        challengeInstruction:
            "<div class='instruction-content'><p/>Optional additional challenge to test your understanding of select functionality.<h><p/>The thieves have several safe houses available to them, but they're only planning to use one of them. Jake needs to know which one.<p/>Select the safe house <b>address</b> where the <b>use</b> key is <b>true</b>.<p/><b>HINT:</b> You'll need to first select the correct object, then pipe the output to return only the address value.</h></div>",
    },

    {
        challengeIntroduction: "Raw output option",
        challengeJson: {
            radioFrequency: "150 MHz",
            pinCode:
                "      .o    .ooooo.     .oooo.     .o \n     .d88   d88'   `8. .dP\"\"Y88b  o888 \n   .d'888   Y88..  .8'       ]8P'  888 \n .d'  888    `88888b.      .d8P'   888 \n 88ooo888oo .8'  ``88b   .dP'      888 \n     888   `8.   .88P .oP     .o  888 \n     o888o   `boood8'  8888888888 o888o",
        },
        challengeAnswer: ".pinCode",
        challengeAnswerOptions: { rawFilter: true },
        challengeInstruction:
            '<div class=\'instruction-content\'><p/>By default jq\'s output will be formatted valid JSON. The -r option (and its long variant,<br/>--raw-output) will lead jq to write directly to standard output instead.#0#<p/><ul><li/>Without the -r option <c>.fruitName</c> will output <o>"apple"</o>, quotes included.<li/>With the -r option <c>.fruitName</c> will output <o>apple</o>. The output is not enclosed in quotes.<li/>Complex output will not be impacted by the raw output option. For example, <c>{fruit: .fruitName}</c> will output the same <o>{"fruit":"apple"}</o> with and without the raw output option.</ul><w>The raw output option should not be included in the filter, but instead passed as a command line argument. For example, <c>echo \'{"key":"value"}\' | jq -r ".key"</c><p/>Check the <b>-r</b> box under <b>OPTIONS</b> to use the raw output option on this site.</w>Be aware that commonly used shells may interpret escape sequences like \\n or \\t (new line and tab, respectively) if they\'re included in the output.#1#<p/>By default the output of <c>.fruitColors</c> will be: #2#<p/>With the raw output option the output will be: #3#<h><p/>Heist participants are using two-way radios to communicate with another. Jake needs to listen in, but he needs their private channel pin code to do so. The <b>pinCode</b> looks like gibberish, but Jake thinks it might be based on older ASCII art technology.<p/>Output the raw value of the <b>pinCode</b> key.</h></div>',
        challengeInstructionJson: [
            {
                output: { fruitName: "apple" },
            },
            {
                output: { fruitName: "apple", fruitColors: "red\ngreen\tyellow" },
            },
            {
                output: "red\ngreen\tyellow",
            },
            {
                formatAsPlainText: true,
                output: "red<br/>green  yellow<br/>",
            },
        ],
    },

    {
        challengeIntroduction: "Variable binding",
        challengeJson: {
            getawayCars: { model: "Ford Transport", carQuantity: 2 },
            carDetails: [
                { carId: 1, driver: "x", plate: "ARTNAPPR" },
                { carId: 2, driver: "x", plate: "SL1PERY" },
            ],
        },
        challengeAnswer: '[.getawayCars.model as $m | "\\($m) with plate \\(.carDetails.[].plate)"]',
        challengeInstruction:
            '<div class=\'instruction-content\'><p/>Variables in jq allow values to be assigned a symbolic name for later use within the filter. There are a few important things to know about variable names:<p/><ul><li/>Variables are denoted by dollar sign followed by the variable name, like <b>$var1</b>.<li/>The variable name should be preceded by the word as.<li/>The variable name (i.e., everything following the dollar sign) should start with an alpha character. Leading numbers are not valid.<li/>Do not use special characters in variable names.<li/>A reminder that jq is case sensitive. <b>$VAR</b> and <b>$var</b> represent two separate variables.</ul><p/>Take the following JSON:#0#<p/><ul><li/>The entire object can be assigned to variable x with a filter of <c>. as $x</c>. This on its own, however, is invalid. jq expects a desired output from the filter, but all this does is assign a variable. A minimally syntactically valid filter could be <c>. as $x | .</c> or <c>. as $x | $x</c>. Both filters assign a variable and their output will be the same, though only the latter actually uses the variable (it\'s perfectly valid to assign a variable and not make use of it).<li/>Variables retain the structure of their assignments. The component parts can therefore be referenced as if you were working with the value directly. <c>. as $x | $x.fruits[0]</c> would output <o>apple</o> since that\'s the first value in the fruits array.<li/>Variables do not need to be used immediately following their assignment. For example,<p/><c>.fruits[0] as $x | .fruits[1] as $y | [$x, $y]</c></p> outputs <o>["apple","kiwi"]</o>. Note that x and y are assigned independently of one another, though they\'re both used in the same statement at the end of the filter. This use case can be especially useful in situations with deeply nest data structures, like a grandparent, parent, and child. Variables can be assigned at the grandparent level and carried over to the child level without having to reference the parent.</ul><p/><w><p/>Be aware that when parentheses are used, the lexical scope of variables is confined to the expressions within those parentheses. Similar to a private class in Java, the variable cannot be referenced outside its scope.<p/>For example, given the following JSON: <o>{"one": 1, "two": 2}</o><p/><c>(. as $x | [$x.one, $x.two])</c> is valid.<p/><c>(. as $x) | [$x.one, $x.two]</c> is not.</w><p/>Variables can also be useful devices for performing lookups. Given the following JSON:#1#<p/>There are two objects. The first, map, contains item names and indicates if they\'re a fruit or a vegetable. The second, sales, contains an array of transactions that includes the item sold. A variable can be used to modify the sales array to output whether an item is a fruit or a vegetable instead of showing the actual item name.<p/>Start by creating a variable for the map. Then filter for the sales array and pipe the output to a new object. The value of the object should be <c>$x[.item]</c>. This will direct jq to search the variable for the key that matches the item from the array. The complete filter, <c>.map as $x | .sales[] | {item: $x[.item]}</c>, would output <o>{"item":"fruit"}</o> for the first element in the sales array.</p>Lastly, variables can be used in the construction of string literals. Here\'s an object with two keys:<p/>#2#<p/><c>.name as $n | .age as $a | "\\($n) is \\($a) years old"</c> will output <o>"Joe is 40 years old"</o>. Note that in order to include the variable within a string the variable needs to be surrounded by parenthesis and escaped with a forward slash.<h><p/>Jake needs to send an alert to all local police patrol cars with the model of the van and the license plate numbers the thieves will be using to transport the stolen art.<p/>Construct an array that meets the following criteria:<ul><li/>The array should contain as many elements as there are objects in the <b>carDetails</b> array.<li/>Each element should consist of a string that takes the format of "<b>getawayCars.model</b> with plate <b>carDetails.plate</b>".<li/>Your solution will need to use a variable(s).<ul></h></div>',
        challengeInstructionJson: [
            {
                output: { fruits: ["apple", "kiwi"] },
            },
            {
                output: { map: { apple: "fruit", kiwi: "fruit", peas: "vegetable" }, sales: [{ item: "kiwi" }, { item: "peas" }] },
            },
            {
                output: {
                    name: "Joe",
                    age: 40,
                },
            },
        ],
    },

    {
        challengeIntroduction: "Variable binding advanced challenge",
        challengeJson: {
            locations: { WW: "West Wing", CR: "Control Room", EN: "Entrance" },
            assignments: [
                { assignee: "Sneaky Steve", location: "WW", toDisable: "motion detectors" },
                { assignee: "Sneaky Steve", location: "CR", toDisable: "cameras" },
                { assignee: "Safecracking Sue", location: "EN", toDisable: "alarms" },
            ],
        },
        challengeAnswer: "[.locations as $l | .assignments[] | {location: $l[.location], toDisable: .toDisable}]",
        challengeInstruction:
            '<div class=\'instruction-content\'><p/>Optional additional challenge to test your understanding of variables.<h><p/>Jake needs to provide a list of security mechanisms that were disabled as part of the heist along with their respective locations, however the <b>assignments</b> array contains objects with a shortened <b>location</b> value that the museum staff won\'t understand.<p/>Thankfully the input JSON also includes a <b>locations</b> object that can be used as a lookup.<p/>Construct an array that meets the following criteria:<ul><li/>The array should contain as many elements as there are objects in the <b>assignments</b> array.<li/>Each element in the array should be an object with two keys, <b>location</b> and <b>toDisable</b>, in that order.<li/>The value for they <b>location</b> key should be the full location name from the <b>locations</b> object, not the shortened variant. For example, the value should be "West Wing", not "WW".<li/>The value for the <b>toDisable</b> key can be carried over from the <b>assignments</b> array.<li/>Your solution will need to make use of a variable.</ul></h></div>',
    },

    {
        challengeIntroduction: "Variable binding with command line argument",
        challengeJson: {
            henchPeople: [
                { personName: "Burglar Barry", favoriteTool: "x-ray glasses" },
                { personName: "Sneaky Steve", favoriteTool: "fake mustache kit" },
            ],
        },
        challengeAnswer: ".henchPeople[].status = $x",
        challengeAnswerOptions: { optionArg: true, argName: "x", argValue: "WANTED" },
        challengeInstruction:
            '<div class=\'instruction-content\'><p/>Variables can be defined from the command line by using the <b>--arg</b> option. This can be useful when variables need to originate from a source other than the input JSON.<p/>Below is a minimal example that illustrates usage. In the example the <b>--arg</b> option is followed by <b>clr</b> and <b>red</b>. This creates a variable named <b>clr</b> and assigns it a value of <b>red</b>.<p/><b>MacOS, Linux, Unix shells:</b><br/><c>echo \'{"fruit":"apple"}\' | jq --arg clr red \'{fruit: .fruit, color: $clr}\'</c><p/><b>Windows command shell:<br/></b><c>echo {"fruit":"apple"} | jq --arg clr red "{fruit: .fruit, color: $clr}"</c><p/>Which outputs:#0#<p/>While generally the variable information covered in the preceding challenges remains relevant here, there are a few considerations to be aware of when using the command line option. <ul><li/>There is no short form for this option. The long form with two dashes must be used.<li/>There is a limit of one variable per argument. A separate <b>--arg</b> statement is needed for each variable. For example, <c>jq --arg x 1 --arg y 2 "."</c> would create two variables, x and y, with values 1 and 2, respectively.<li/>There is a related <b>--argjson</b> option that accepts JSON as input for a variable.<li/>All variables defined via the command line will have a string type. If the variable needs to be numeric, convert it using the <b>tonumber</b> function. As an example, a variable named <b>quantity</b> is defined as <b>2</b> using a command line argument. If it is multiplied by a key named <b>fruit</b> with a value of <b>4</b>, the result of <c>.fruit * $quantity</c> will be <o>2222</o>, not <o>8</o> as expected. In this case 2 is a string, which jq then repeats four times. To get the correct result use <c>.fruit * ($quantity | tonumber)</c>. The parenthesis ensure the variable is converted to a number before any other operation take place.</ul><w><p/>In jq Jake command line arguments should not be included in the filter field.<p/>To complete this challenge:<ul><li/>Check the box labeled <b>--arg</b> under <b>OPTIONS</b>. Once checked two boxes will appear.<li/>The argument name (i.e., the variable name) should be entered into the first input box.<li/>The argument value (i.e., the value assigned to the variable) should be entered into the second input box.</ul></w><h><p/>Jake wants to created WANTED posters to hang in the local post office.<p/><ul><li/>Add a <b>status</b> key with a value of <b>"WANTED"</b> to each object within the <b>henchPeople</b> array.<li/>The solution should use a variable sourced via the <b>--arg</b> option.</ul></h></div>',
        challengeInstructionJson: [
            {
                output: { fruit: "apple", color: "red" },
            },
            {
                output: { fruit: "apple", quantity: 5 },
            },
        ],
    },

    {
        challengeIntroduction: "Variable binding with command line argument advanced challenge",
        challengeJson: {
            description: "Wipe surveillance camera footage",
            startTime: "18:30",
            cameras: [
                { camera: "Front entrance", hours: 1.5 },
                { camera: "Rotunda", hours: 3.25 },
            ],
        },
        challengeAnswer: "[.cameras[] | {camera: .camera, minutes: (.hours * ($minutesPerHour | tonumber))}]",
        challengeAnswerOptions: { optionArg: true, argName: "minutesPerHour", argValue: 60 },
        challengeInstruction:
            "<div class='instruction-content'><p/>Optional additional challenge to test your understanding of assigning variables using command line arguments.<h><p/>The thieves have wiped surveillance footage. Luckily there are backups. Jake needs to know how much footage to request in minutes.<p/>Construct an array that meets the following criteria:<ul><li/>The array should contain as many elements as there objects in the <b>cameras</b> array.<li/>Each element should be an object with two keys, <b>camera</b> and <b>minutes</b>, in that order.<li/>The value for the <b>camera</b> key can be carried over from the input array.<li/>The value for the <b>minutes</b> array should be the result of <b>hours</b> multiplied by a variable.<li/>The value of the variable should be <b>60</b>.</ul><p/><b>HINT</b>: You'll need to coerce the string-based variable to a number using the tonumber function as covered in the previous challenge. </ul></h></div>",
    },

    {
        challengeIntroduction: "Outputting in CSV and TSV",
        challengeJson: {
            alibis: [
                { person: "Burglar Barry", alibi: "Rescuing puppies" },
                { person: "Sneaky Steve", alibi: "Helping elderly cross road" },
                { person: "Safecracking Sue", alibi: "Planting trees" },
            ],
        },
        challengeAnswer: ".alibis[] | [.person, .alibi] |@csv",
        challengeAnswerOptions: { rawFilter: true },
        challengeInstruction:
            "<div class='instruction-content'><p/>JSON as a format enjoys wide support across many languages and applications. Despite its popularity, support is not universal. Applications like Excel and some databases do not natively support JSON. In these situations jq can be used to transform JSON into CSV or TSV formats (comma separated values and tab separated values, respectively). <p/>Take the following array comprised of two arrays:#0#<p/>A simple iterator of <c>.[]</c> will return:#1#<p/>Note that this is not valid JSON. It's two arrays, each on their own line, fully independent of one another. This is important. Before we can convert to CSV or TSV we need to first flatten our JSON into a series of arrays. <p/>Once we have a flat set of arrays we can output in CSV format by adding <c>|@csv</c> to the end of the filter, like <c>.[]|@csv</c>. This will output:#2#<p/><ul><li/><c>@csv</c> indicates the output format should be in CSV. <c>@tsv</c> will output in TSV.<li/>The instruction to output in CSV or TSV should be placed on its own and should have its input piped from the preceding component within the filter.<li/>CSV and TSV expect an array as input. <b>Each array within the series will generate a row within the output</b>. Remember that <c>.[]</c> will output independent arrays with a line break between them (i.e., not valid JSON), it will not output nested arrays like the original input.<li/>Since jq evaluates each array separately, you should consider whether you need the input arrays to have the same number of elements. If the length of the input varies, so to will the output. This will be a problem if you expect to import the CSV or TSV into an application that's expecting a fixed number of columns.<li/>Generally the -r option should be used in conjunction with CSV and TSV in order to suppress unwanted control characters.</ul><p/>Here's a more complex input array:#3#<p/>We're still starting with an array, but this time each element contains an object. As with the first example, before we can output to CSV we first have to build a series of independent arrays. In this example that can be done with array construction. <c>.[] | [.fruit, .skin]</c> will output:#4#<p/>Once again adding <c>|@csv</c> will convert the output to CSV.#5#<p/>The complete filter is <c>.[] | [.fruit, .skin]|@csv</c>.<h><p/>Oh no, the Crime Analyzer 3000 is down. We'll have to use the older Crime Analyzer 50 instead. Unfortunately it only accepts CSV as input.<p/>Generate CSV output that meets the following conditions:<ul><li/>It should contain as many rows as there objects in the <b>alibis</b> array.<li/>Each row should contain the <b>person</b> and the <b>alibi</b>, in that order.<li/>The output should be in CSV format.</ul><p/><b>HINT</b>: Remember to use the <b>-r</b> option.</h></div>",
        challengeInstructionJson: [
            {
                output: [
                    ["apple", "grape"],
                    ["kiwi", "banana"],
                ],
            },
            {
                formatAsPlainText: true,
                output: '["apple","grape"]<br/>["kiwi","banana"]',
            },

            {
                formatAsPlainText: true,
                output: '"apple","grape"<br/>"kiwi","banana"',
            },

            {
                output: [
                    { fruit: "apple", skin: "thin" },
                    { fruit: "banana", skin: "thick" },
                ],
            },

            {
                formatAsPlainText: true,
                output: '["apple","thin"]<br/>["banana","thick"]',
            },
            {
                formatAsPlainText: true,
                output: '"apple","thin"<br/>"banana","thick"',
            },
        ],
    },

    {
        challengeIntroduction: "Outputting in CSV and TSV with headers",
        challengeJson: {
            alibis: [
                { person: "Burglar Barry", alibi: "Rescuing puppies" },
                { person: "Sneaky Steve", alibi: "Helping elderly cross road" },
                { person: "Safecracking Sue", alibi: "Planting trees" },
            ],
        },
        challengeAnswer: '["PERSON_NM","ALIBI_NM"], (.alibis[] | [.person, .alibi]) |@csv',
        challengeAnswerOptions: { rawFilter: true },
        challengeInstruction:
            "<div class='instruction-content'><p/>jq does not contain an inbuilt mechanism to add headers to CSV or TSV, but this can be done manually by combining several tricks that were previously covered.<p/>Here's the same JSON from the previous challenge.#0#<p/>How can we add a header row? Previously we used this filter:<p/><c>.[] | [.fruit, .skin]|@csv</c><p/>Prepending an array of hardcoded values containing the desired header names to the beginning of the filter will give us a header row.<p/><c>[\"FRUIT\",\"SKIN\"], (.[] | [.fruit, .skin])|@csv</c><p/>Returns: #1#<p/>Breaking this down:<p/><ul><li/>Remember that we can construct an array with hardcoded values. The first part of the filter is a hardcoded array with field names we want to use. In this case the names mirror the names from the originating JSON, but there's no requirement to do so.<li/>The hardcoded array is followed by a comma to separate it from the next piece of the filter. jq processes them as individual instructions. <li/>The iterator and the array construction is surrounded by parenthesis so that jq knows to process that on its own.<li/>Lastly the entire result is piped to @csv. jq will see four arrays. One header row and three rows of data, though jq doesn't make that distinction. Each of the arrays are processed and outputted as a row.</ul><h><p/>Repeat the previous challenge, but this time add a header row. <p/>Generate CSV output that meets the following conditions:<ul><li/>It should contain a preceding header row, plus as many rows of data as there objects in the <b>alibis</b> array.<li/>The header row should have two fields, <b>PERSON_NM</b> and <b>ALIBI_NM</b>, in that order. Note that both are different than the keys from the originating JSON.<li/>Both field names in the header should be upper case.<li/>Each row of data should contain the values from the <b>person</b> and the <b>alibi</b> keys, in that order.<li/>The output should be in CSV format.</ul> <p/><b>HINT</b>: Remember to use the <b>-r</b> option.</h></div>",
        challengeInstructionJson: [
            {
                output: [
                    { fruit: "apple", skin: "thin" },
                    { fruit: "banana", skin: "thick" },
                ],
            },

            {
                formatAsPlainText: true,
                output: '"FRUIT","SKIN"<br/>"apple","thin"<br/>"banana","thick"',
            },
        ],
    },

    {
        challengeIntroduction: "Returning unique values",
        challengeJson: {
            orderFrom: "Bob the Boss",
            orders: "Split illicit proceeds across accounts",
            secretAccounts: [
                { accountId: 1, bankName: "Misplaced Trust Bank", accountNumber: "38813-2218843" },
                { accountId: 2, bankName: "Slightly Shady Savings", accountNumber: "92213-8810901" },
                { accountId: 3, bankName: "Misplaced Trust Bank", accountNumber: "38813-5104994" },
            ],
        },
        challengeAnswer: ".secretAccounts | map(.bankName) | unique",
        challengeInstruction:
            '<div class=\'instruction-content\'><p/>The unique function will parse an array and return an array with duplicates removed, similar to the distinct function in SQL or a set in Python.<p/>Unique expects an array as input. Anything other than an array will return an error.<p/>Take the following simple array with four values, three of which are unique: #0#<p/>A filter of <c>unique</c> will return <o>[null, "apple", "kiwi"]</o>.<p/>Unique will sort output in the following order: nulls, boolean values, numbers, strings, arrays, and finally objects. <w><p/>Since jq is case sensitive <b>APPLE</b>, <b>Apple</b>, and <b>apple</b> are three separate values. As a workaround string values can be piped to ascii_downcase or ascii_upcase before being piped to unique, though this will potentially return output in a different case than that of the input. The following demonstrates a basic example:<p/> <c>[.[] | if . == null then . else ascii_upcase end] | unique</c><p/>Returns: <o>[null, "APPLE","KIWI"]</o>. Since jq will return an error when asked to convert the case of anything other than a primitive string, conditional logic is needed to skip values that are null.</w><p/>In addition to operating against primitives, unique can also be used with objects and arrays. For example: #1#<p/>A filter of <c>unique</c> will return an array with two objects, <o>[{"fuit": "kiwi"},{"fuit": "apple"}]</o>. <h><p/>Looks like the heisters deposited funds from the sale of the artwork into several bank accounts. Jake needs to prepare warrants, but he doesn\'t want to do duplicate Worker. <p/>Help Jake prepare the warrants by returning a unique list of values from the <b>bankName</b> key.<p/><b>HINT</b>: Make sure your values are in an array before piping to unique.</h></div>',

        challengeInstructionJson: [
            {
                output: ["kiwi", "apple", null, "kiwi"],
            },
            {
                output: [{ fuit: "kiwi" }, { fuit: "apple" }, { fuit: "apple" }],
            },
        ],
    },

    {
        challengeIntroduction: "Retrieving keys",
        challengeJson: {
            specialTool: "Cloud Caper",
            toolDescription: {
                toolPurpose: "Create smoke cloud for escape",
                quantityNeeded: 4,
                purchaseFrom: "Bandit Bazaar",
            },
        },
        challengeAnswer: ".toolDescription | keys",
        challengeInstruction:
            '<div class=\'instruction-content\'><p/> When faced with unfamiliar or undocumented JSON files a good starting point is often a basic investigation of the data structure. The keys function can be used to retrieve a list of, unsurprisingly, keys. Take the following object: <p/>#0#<p/>The keys can be retrieved with the <c>keys</c> function. Note that since this is a function there\'s no preceding period. This will return the three object keys as an array:</br> <o>["fruitHasSeeds","fruitName","fruitShape"]</o>.<p/>Since keys returns an array the same slicing techniques we learned when first looking at arrays can be used.<ul><li/><c>keys[0]</c> will return the first item in the array, <o>"fruitHasSeeds"</o>. Look closely at the array in the full output. <b>fruitHasSeeds</b> is the first element even though it\'s the last item in the original object. Why? Because keys returns a sorted array. In alphabetical order <b>fruitHasSeeds</b> comes before <b>fruitName</b> and <b>fruitShape</b>.<li/>If preserving the original order is important, <c>keys_unsorted</c> can be used. <c>keys_unsorted[0]</c> will return the first item encounter from the array, in this case <o>"fruitName"</o>.<li/>Adding brackets to keys function, like <c>keys[]</c>, will act as an iterator. The output will not be returned as an array.<li/>The general expectation is that keys will be passed an object. Keys will, however, return output and not an error when passed something other than an object. For example, given an array of <o>["apple","kiwi"]</o> keys will return <o>[0,1]</o>. </ul> <h><p/>Jake\'s found a snippet from a larger array of special tools required. He\'s going to build an inventory off of this, but to get started he needs a list of keys.<p/>Return a sorted array with a unique list of keys in the <b>toolDescription</b> object.</h></div>',
        challengeInstructionJson: [
            {
                output: { fruitName: "Apple", fruitShape: "Spherical", fruitHasSeeds: true },
            },
        ],
    },

    {
        challengeIntroduction: "Retrieving keys advanced challenge",
        challengeJson: {
            insiders: [
                { insiderId: 1, insiderName: "Gossipy Gary", insiderPosition: "Security Agent", insiderNeedsPayout: true },
                { insiderId: 2, insiderName: "Babbling Bert", insiderPosition: "Ticket Agent", insiderShift: "Weekday mornings" },
            ],
        },
        challengeAnswer: ".insiders | map(keys[]) | unique",
        challengeInstruction:
            "<div class='instruction-content'><p/>Optional additional challenge to test your understanding of the keys function. <h><p/>Looks like the heisters had some inside help!<p/>Jake needs to put together a preliminary report for museum security with relevant information on the insiders, but before he does that he needs a complete list of keys from the insiders array.<p/>Return an array with a unique list of keys from the two objects in the insiders array.<p/><b>HINT</b>: The structure of the objects is not the same. Three keys are shared across both objects, but the last key in each is unique to that object. You may want to first build an array with eight keys, including duplicates, then pipe that to the unique function.</h></div>",
    },

    {
        challengeIntroduction: "Determining type",
        challengeJson: { sculptureName: "Grumpy Grandmaster", sculptorName: "Chisel McGiggle", sculptureAge: 120, isMarble: true },
        challengeAnswer: ".sculptureAge | type",
        challengeInstruction:
            "<div class='instruction-content'><p/>The type function can be used to determine the data type of its input, whether it's a primitive, object, or array. Let's look at the JSON below. #0#<p/>The <c>type</c> function on its own will return <o>array</o> because all other items are contained within the array. Unless we iterate over the elements within the array, only the array itself will be evaluated. <p/>By iterating over the elements we can get the type of each. <c>map(. | type)</c> returns: #1#<p/>That filter will iterate over each element by using the map function. Each element is then individually piped to type for evaluation. <h><p/>Jake would like to set up a database with sculpture attributes, but he's not clear on a few of the data types.<p/>Return the type for the <b>sculptureAge</b> key.</h></div>",
        challengeInstructionJson: [
            {
                output: [1, "two", true, null, { fruitName: "kiwi" }, ["cat", "dog"]],
            },
            {
                output: ["number", "string", "boolean", "null", "object", "array"],
            },
        ],
    },

    {
        challengeIntroduction: "Final challenge",
        challengeIsLast: true,
        challengeJson: {
            heistTarget: "National Museum of Interesting Art",
            plannedBy: "Mel the Mastermind",
            piecesTaken: 10,
            heistSuccessful: true,
        },
        challengeAnswer: ".heistSuccessful = false | .piecesRecovered = 10",
        challengeInstruction:
            '<div class=\'instruction-content\'><p/>Congratulations, you did it!<p/>With your help Jake has managed to find and recover the heisted artwork and has arrested those responsible.<p/>Below are additional resources that you may find helpful as you continue your jq journey.<p/><ul><li/> <a href="https://jqlang.github.io/jq/manual/" target="_blank">Official jq documentation</a><li/><a href="https://jqplay.org/" target="_blank">jq play, a playground for jq</a> <li/> <a href="https://discord.gg/yg6yjNmgAC" target="_blank">jq Discord server</a></ul><h><p/>Good job helping Jake outwit Mel the Mastermind. There\'s one post-heist JSON that Jake would like to update on behalf of the failed heisters.<p/>Make the following changes to the JSON object.<ul><li/>Update the value for the <b>heistSuccessful</b> key to be <b>false</b>.<li/>Add a new <b>piecesRecovered</b> key and set the value to <b>10</b>.</ul><p/><b>HINT</b>: A pipe can be used to chain multiple changes in one filter.</h></div>',
    },
];

const challenges = challengesWithoutId.map((e) => ({
    ...e,
    challengeAnswerOptions: {
        rawFilter: typeof e.challengeAnswerOptions?.rawFilter === "undefined" ? false : e.challengeAnswerOptions.rawFilter,
        optionArg: typeof e.challengeAnswerOptions?.optionArg === "undefined" ? false : e.challengeAnswerOptions.optionArg,
        argName: typeof e.challengeAnswerOptions?.optionArg === "undefined" ? "" : e.challengeAnswerOptions.argName,
        argValue: typeof e.challengeAnswerOptions?.optionArg === "undefined" ? "" : e.challengeAnswerOptions.argValue,
    },

    challengeId: e.challengeIntroduction.toLowerCase().replaceAll(/[^a-z0-9]/g, "-"),
    challengeInstruction: e.challengeInstruction
        .replaceAll("<c>", "<span class='instruction-inline-code'>")
        .replaceAll("</c>", "</span>")
        .replaceAll("<h>", "<div class='instruction-challenge'><div class='instruction-challenge-title'>CHALLENGE</div>")
        .replaceAll("</h>", "</div>")
        .replaceAll("<o>", "<span class='instruction-inline-output'>")
        .replaceAll("</o>", "</span>")
        .replaceAll("<w>", "<div class='instruction-caution-container'><div class='instruction-caution-title'>CAUTION</div>")
        .replaceAll("</w>", "</div>")
        .replaceAll("<n>", "<div class='instruction-notice-container'>")
        .replaceAll("</n>", "</div>"),
}));

export { challenges };
