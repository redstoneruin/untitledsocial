import {validateUsername, validateBio, validateEmail, validatePassword,
        validateTitle, validateDesc, validateContent, getValidLink} from './validation';

/**
 * Username validation tests
 */
describe('username validation', () => {
    test('validate username under 5 characters', () => {
        expect(validateUsername("user")).toEqual({username: false, usernameMessage: "Username too short."});
    });

    test('validate empty username', () => {
        expect(validateUsername("")).toEqual({username: false, usernameMessage: "Please enter a username."});
    });

    test('validate username over 30 characters', () => {
        expect(validateUsername("asdklfjlsdflkjasdlkfjasldkjflaskdjflkjsadflkjasdlfkjsaldkfjlaskdjfasdfasdfasdf"))
        .toEqual({username: false, usernameMessage: "Username too long."});
    });

    test('validate correct username', () => {
        expect(validateUsername("rsteinwe")).toEqual({username: true, usernameMessage: null});
    });
});

/**
 * Bio validation tests
 */
describe('bio validation', () => {
    test('validate empty bio', () => {
        expect(validateBio("")).toEqual({bio: true, bioMessage: null});
    });

    test('validate bio > 1000 chars', () => {
        expect(validateBio("asdfasdfjlkasjdflkjasdlfkjlkasdjflkjasdflkjsadlfkjasldkjfas"
        + "asldkfjasdlfkjasdfkjalskdjflksjadflkjasdlfkjasldkfjlaskdjflkjasdlfkjalskdjfl"
        + "lkjasdlfkjalskjdflkjasdlkfjlasjdlkfjlkasjdflkjalskjdflkjasdlkfjljasdkfljlask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"))
        .toEqual({bio: false, bioMessage: "Bio too long."});
    });

    test('validate non-empty valid bio', () => {
        expect(validateBio("lklkajsdflkjasdlfk"))
        .toEqual({bio: true, bioMessage: null});
    });
});

/**
 * Email validation tests
 */
describe('email validation', () => {
    test('validate empty email', () => {
        expect(validateEmail(""))
        .toEqual({email: false, emailMessage: "Please enter an email address."});
    });

    test('validate non-empty invalid email', () => {
        expect(validateEmail("llkajsdfdsflkj"))
        .toEqual({email: false, emailMessage: "Please enter a valid email address."});
    });

    test('validate correctly formatted email', () => {
        expect(validateEmail("test@test.com"))
        .toEqual({email: true, emailMessage: null});
    });
});

/**
 * Password validation tests
 */
describe('password validation', () => {
    test('validate empty password', () => {
        expect(validatePassword(""))
        .toEqual({password: false, passwordMessage: "Please enter a password."});
    });

    test('validate password under 8 characters', () => {
        expect(validatePassword("test"))
        .toEqual({password: false, passwordMessage: "Password must be 8 characters or more."});
    });

    test('validate correctly formatted password', () => {
        expect(validatePassword("aslkjsadflkj"))
        .toEqual({password: true, passwordMessage: null});
    });
});

/**
 * Title validation tests
 */
describe('title validation', () => {
    test('validate empty title', () => {
        expect(validateTitle(""))
        .toEqual({title: false, titleMessage: "Please enter a title."});
    });

    test('validate correctly formatted title', () => {
        expect(validateTitle("title"))
        .toEqual({title: true, titleMessage: null});
    });
});

/**
 * Description validation tests
 */
describe('description validation', () => {
    test('validate empty description', () => {
        expect(validateDesc(""))
        .toEqual({desc: false, descMessage: "Please enter a description."});
    });

    test('validate description > 5000 chars', () => {
        expect(validateDesc("asdfasdfjlkasjdflkjasdlfkjlkasdjflkjasdflkjsadlfkjasldkjfas"
        + "asldkfjasdlfkjasdfkjalskdjflksjadflkjasdlfkjasldkfjlaskdjflkjasdlfkjalskdjfl"
        + "lkjasdlfkjalskjdflkjasdlkfjlasjdlkfjlkasjdflkjalskjdflkjasdlkfjljasdkfljlask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "asldkfjasdlfkjasdfkjalskdjflksjadflkjasdlfkjasldkfjlaskdjflkjasdlfkjalskdjfl"
        + "lkjasdlfkjalskjdflkjasdlkfjlasjdlkfjlkasjdflkjalskjdflkjasdlkfjljasdkfljlask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "asldkfjasdlfkjasdfkjalskdjflksjadflkjasdlfkjasldkfjlaskdjflkjasdlfkjalskdjfl"
        + "lkjasdlfkjalskjdflkjasdlkfjlasjdlkfjlkasjdflkjalskjdflkjasdlkfjljasdkfljlask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "asldkfjasdlfkjasdfkjalskdjflksjadflkjasdlfkjasldkfjlaskdjflkjasdlfkjalskdjfl"
        + "lkjasdlfkjalskjdflkjasdlkfjlasjdlkfjlkasjdflkjalskjdflkjasdlkfjljasdkfljlask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "asldkfjasdlfkjasdfkjalskdjflksjadflkjasdlfkjasldkfjlaskdjflkjasdlfkjalskdjfl"
        + "lkjasdlfkjalskjdflkjasdlkfjlasjdlkfjlkasjdflkjalskjdflkjasdlkfjljasdkfljlask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        + "laksjdflkjasdlkfjlkasjdlfkjaslkdjflkasjdflkjasdlfkjsladkjflksadjflkasjdflask"
        ))
        .toEqual({desc: false, descMessage: "Description over 1000 character limit."});
    });
});

/**
 * Validation for links in content field
 */
describe('content validation', () => {
    test('validate link format', () => {
        expect(validateContent("https://google.com"))
            .toEqual({content: true, contentMessage: null});

        expect(validateContent("ayy.lmao."))
            .toEqual({content: false, contentMessage: "Not a valid link."});
    });

    test('test getValidLink with http handlers', () => {
        expect(getValidLink("www.google.com"))
            .toEqual("http://www.google.com");

        expect(getValidLink("https://google.com"))
            .toEqual("https://google.com");

        expect(getValidLink("http://google.com"))
            .toEqual("http://google.com");
    });
})
