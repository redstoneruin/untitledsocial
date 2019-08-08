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
    } else if(username.length > 30) {
        valid.username = false;
        valid.usernameMessage = "Username too long.";
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
        valid.descMessage = "Please enter a description.";
    } else if(desc.length > 5000) {
        valid.desc = false;
        valid.descMessage = "Description over 1000 character limit.";
    } else {
        valid.desc = true;
        valid.descMessage = null;
    }
    return valid;
}

/**
 * Get type of post based on fields of post param and included files
 * @param {Object} post - Post to validate type 
 * @param {*} files - Files intented for upload
 */
export const getPostType = (post, files) => {
    if(!post) {
        return null;
    }

    if(!post.content && !files) {
        // Neither files nor link exists, text post
        return "text";
    } else if(!post.content) {
        // files exist, link does not
        if(files.length > 1) {
            // multiple files, album type
            return "album";
        } else if(files.length === 0) {
            return "text";
        } else {
            var fileType = files[0].type;
            // single file, determine whether image or video
            if(fileType === "image/gif" || fileType === "image/jpeg" || fileType === "image/webp"
            || fileType === "image/svg+xml") {
                return "image";
            } else {
                return "video";
            }
        }
    } else if(!files) {
        // Link exists, files do not
        return "link";
    }

    // default to text
    return "text";
}