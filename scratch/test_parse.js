var fso = new ActiveXObject("Scripting.FileSystemObject");

function parseFile(filePath, varName) {
    var file = fso.OpenTextFile(filePath, 1, false, -2);
    var content = file.ReadAll();
    file.Close();
    
    var window = {};
    eval(content);
    return window[varName];
}

var articles = parseFile("c:\\Users\\vc\\Documents\\nls-blog-hame\\nls-blog-hame\\blog\\default-articles.js", "NLS_DEFAULT_ARTICLES");
var events = parseFile("c:\\Users\\vc\\Documents\\nls-blog-hame\\nls-blog-hame\\kalender\\default-events.js", "NLS_DEFAULT_EVENTS");
var teachers = parseFile("c:\\Users\\vc\\Documents\\nls-blog-hame\\nls-blog-hame\\pengajar\\default-teachers.js", "NLS_DEFAULT_TEACHERS");

WScript.Echo("Articles count: " + articles.length);
WScript.Echo("Events count: " + events.length);
WScript.Echo("Teachers count: " + teachers.length);
