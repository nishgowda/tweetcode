/*
    @file: index.js
    @author: Nish Gowda
    @data: 08/03/20
    @about: File that handles our Index and Create pages
    Sends requests to our REST API via ajax to GET JSON data
    and set POST data.
*/
$(document).ready(function(){

    // Get request to our api, retrieve all the codetweets in the database
    let uid, label;
    $.ajax({
        url : "/api/tweets",
        type: "GET",
        success: function(result){
            let table = $("#codeTweets");
            for (let i = 0; i < result.length; i ++){
                if (result[i].uid == result[0].currentUid){
                    table.append('<tr><td>' + result[i].username.replace(/'/g, "") + `<img class="avatar" src="${result[i].imageUrl}"`+'</td><td>' +result[i].title.replace(/'/g, "") + '</td><td>' + result[i].date +'</td><td>'+ `<a href="/showtweet/${result[i].cid}">View Tweet</a>` +  '</td><td>' +`<a href="/delete/${result[i].cid}">Delete</a>` + '</tr>');
                }else{
                    table.append('<tr><td>' + result[i].username.replace(/'/g, "") + `<img class="avatar" src="${result[i].imageUrl}"` + '</td><td>' +result[i].title.replace(/'/g, "")+ '</td><td>' + result[i].date +'</td><td>'+ `<a  href="/showtweet/${result[i].cid}">View Tweet</a>` +  '</td><td>' +`<a class="isDisabled" href="/delete/${result[i].cid}">Delete</a>` + '</tr>');
                }
            }
            let navbar = $("#navitem");
            uid = result[0].currentUid;
            label = result[0].currentUser;
            navbar.append('<li><a>' + `<img class="userAvatar" src="${result[0].currentUserImg}"` + '</a></li>');
        },
        error: function(error){
            window.location.href = error.responseText;
        }
    });
    // Selector for the language options
    let select = $("#language");
    let editor;
    let langs = ['abap', 'apex', 'azcli', 'bat', 'cameligo', 'clojure', 'coffee', 'cpp', 'csharp', 'csp', 'css', 'dockerfile', 'fsharp', 'go', 'graphql', 'handlebars', 'html', 'ini', 'java', 'javascript', 'json', 'kotlin', 'less', 'lua', 'markdown', 'mips', 'msdax', 'mysql', 'objective-c', 'pascal', 'pascaligo', 'perl', 'pgsql', 'php', 'postiats', 'powerquery', 'powershell', 'pug', 'python', 'r', 'razor', 'redis', 'redshift', 'restructuredtext', 'ruby', 'rust', 'sb', 'scheme', 'scss', 'shell', 'solidity', 'sophia', 'sql', 'st', 'swift', 'tcl', 'twig', 'typescript', 'vb', 'xml', 'yaml'];
    for(var i = 0; i < langs.length; i++) {
        var opt = langs[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.append(el);
    }
   
    $(function(){

        // Setup to display the Monaco Editor
        require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }});
        window.MonacoEnvironment = { getWorkerUrl: () => proxy };
        let proxy = URL.createObjectURL(new Blob([`
            self.MonacoEnvironment = {
                baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
            };
            importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
        `], { type: 'text/javascript' }));

        require(["vs/editor/editor.main"], function () {
            editor = monaco.editor.create(document.getElementById('code_editor'), {
                value: [
                    'function x() {',
                    '\tconsole.log("Hello world!");',
                    '}'
                ].join('\n'),
                language: 'javascript',
                theme: 'vs'
            });
    
        // Update langauge value when user selects from options
        $('#language').on('change', function() {
            language = $("#language").val();
            monaco.editor.setModelLanguage(editor.getModel(), language);
            console.log(`model language was changed to ${editor.getModel().getLanguageIdentifier().language}`);
            });
        // Update theme when user selects from options
        $('#theme').on('change', function() {
                let theme = $("#theme").val();
                monaco.editor.setTheme(theme);
                });
        
            $("#create_form").on("submit", function(e){
            e.preventDefault();
            // Object that will be passed in via POST to our API 
            // Grab the data from the code editor and language from selections
            var formData = {
                'code': editor.getModel().getValue().replace(/'/g, ''),
                'language': $('#language').val(),
                 'title': $('#title').val()
            };
            $.ajax({
                url: "/api/create",
                type: "POST",
                data: JSON.stringify(formData),
                contentType: 'application/json',
                dataType: "json",
                success: function(data){
                    window.location.replace("/tweets"); 
                },
                error: function(error){
                    if (error.responseText == "Unauthorized"){
                        window.location.href = error.responseText;
                    }else{
                        alert(error.responseText);
                    }

                }
            });
           
        });
    })


    


});
});
