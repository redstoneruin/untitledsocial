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

/**
 * Validate email format
 * @param {string} email - email string to validate
 */
export const validateEmail = (email) => {
    // Email regex pattern
    const emailPattern = new RegExp(/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    var valid = {};
    
    if(!email) {
        valid.email = false;
        valid.emailMessage = "Please enter an email address.";
    } else if(emailPattern.test(email)) {
        valid.email = true;
        valid.emailMessage = null;
    } else {
        valid.email = false;
        valid.emailMessage = "Please enter a valid email address."
    }

    return valid;
}

/**
 * Validate password format
 * @param {string} password - password string to validate
 */
export const validatePassword = (password) => {
    var valid = {};

    if(!password) {
        valid.password = false;
        valid.passwordMessage = "Please enter a password."
    } else if(password.length < 8) {
        valid.password = false;
        valid.passwordMessage = "Password must be 8 characters or more."
    } else {
        valid.password = true;
        valid.passwordMessage = null;
    }

    return valid;
}

/**
 * Validate title string
 * @param {string} title - Title string to validate
 */
export const validateTitle = (title) => {
    var valid = {};

    if(!title) {
        valid.title = false;
        valid.titleMessage = "Please enter a title.";
    } else {
        valid.title = true;
        valid.titleMessage = null;
    }
    return valid;
}

/**
 * Validate description string
 * @param {string} desc - Description string to validate
 */
export const validateDesc = (desc) => {
    var valid = {};

    if(!desc) {
        valid.desc = false;
        valid.descMessage = "Please enter a title";
    } else if(desc.length > 1000) {
        valid.desc = false;
        valid.descMessage = "Description over 1000 character limit";
    } else {
        valid.desc = true;
        valid.descMessage = null;
    }
    return valid;
}