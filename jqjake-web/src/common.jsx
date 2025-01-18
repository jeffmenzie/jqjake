import stringify from "json-stringify-pretty-compact";

const syntaxHighlight = (json) => {
    return json.replace(/("([^"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let st = 'style="color:#b6562d;"'; // default, number

        // if starts with a double quote:
        if (/^"/.test(match)) {
            // and ends with a colon, it's a key
            if (/:$/.test(match)) {
                st = 'style="color:#1221a3;font-weight:600;"';
                // otherwise it's a string
            } else {
                st = 'style="color:#167d3a;"'; // string b6562d
            }
        } else if (/true|false/.test(match)) {
            st = 'style="color:#b6562d;"'; // boolean
        } else if (/null/.test(match)) {
            st = 'style="color:thistle;"'; //null
        }
        // return
        if (/:$/.test(match)) {
            return `<span ${st}>${match.slice(0, -1)}</span>:`;
        } else {
            return `<span ${st}>${match}</span>`;
        }
    });
};

const windowWidth = window.innerWidth;
const jsonMaxLength = windowWidth <= 1000 ? 30 : 45;

const stringifyJsonForChallengeInstruction = (instructionBlock, json) => {
    // find text between ##
    return instructionBlock.replace(/([#]).*?([#])/g, (match) => {
        const numberBlock = parseInt(match.substring(1, match.length - 1));

        if (json[numberBlock].formatAsPlainText === true) {
            return "<pre>" + json[numberBlock].output + "</pre>";
        } else {
            return "<pre>" + stringify(json[numberBlock].output, { maxLength: jsonMaxLength, indent: 4 }) + "</pre>";
        }
    });
};

export { syntaxHighlight, stringifyJsonForChallengeInstruction };
