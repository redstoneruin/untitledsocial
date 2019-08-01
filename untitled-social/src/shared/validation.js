/**
 * Validate username, returns valid object with username and usernameMessage properties
 * @param {string} username - Username to validate
 */
export const validateUsername = (username) => {
    // valid object to return
    var valid = {};

    if(!username) {
        valid.username = false;
        valid.usernameMessage = "Please enter a username.";
    } else if(username.length < 5) {
        valid.username = false;
        valid.usernameMessage = "Username too short.";
    } else {
        valid.username = true;
        valid.usernameMessage = null;
    }

    return valid;
}

/**
 * Validate bio, returns valid object with bio and bioMessage properties
 * @param {string} bio - Bio string to validate
 */
export const validateBio = (bio) => {
    // valid object to return
    var valid = {};

    if(!bio) {
        valid.bio = true;
        valid.bioMessage = null;
    } else if(bio.length > 1000) {
        valid.bio = false;
        valid.bioMessage = "Bio too long.";
    } else {
        valid.bio = true;
        valid.bioMessage = null;
    }

    return valid;
}