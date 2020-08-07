/*
    @file: update.js
    @author: Nish Gowda
    @data: 08/03/20
    @about: File that handles our showtweet.html file.
    Updates values whenever a user decides to edit an existing tweet
    and pulls the saved contents from db on load. Makes PUT and GET requests
    to our API.
*/

$(document).ready(function(){

    let url = window.location.href;
    let sub = url.replace('http://localhost:3000/showtweet/', '')
    let cid = parseInt(sub);
    var editor;
    
    // dynamically add options to language select
    var select = $("#language");
    var langs = ['abap', 'apex', 'azcli', 'bat', 'cameligo', 'clojure', 'coffee', 'cpp', 'csharp', 'csp', 'css', 'dockerfile', 'fsharp', 'go', 'graphql', 'handlebars', 'html', 'ini', 'java', 'javascript', 'json', 'kotlin', 'less', 'lua', 'markdown', 'mips', 'msdax', 'mysql', 'objective-c', 'pascal', 'pascaligo', 'perl', 'pgsql', 'php', 'postiats', 'powerquery', 'powershell', 'pug', 'python', 'r', 'razor', 'redis', 'redshift', 'restructuredtext', 'ruby', 'rust', 'sb', 'scheme', 'scss', 'shell', 'solidity', 'sophia', 'sql', 'st', 'swift', 'tcl', 'twig', 'typescript', 'vb', 'xml', 'yaml'];
    for(var i = 0; i < langs.length; i++) {
        var opt = langs[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.append(el);
    } 
   
    // setup Monaco Editor 
    require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }});
    window.MonacoEnvironment = { getWorkerUrl: () => proxy };
    let proxy = URL.createObjectURL(new Blob([`
        self.MonacoEnvironment = {
            baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
        };
        importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
    `], { type: 'text/javascript' }));
        
    let USER = {
        label: '',
        color: "#" + Math.floor(Math.random()*16777215).toString(16)
    };
    require(["vs/editor/editor.main"], function () {
       monaco.editor.defineTheme('my-vs', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                'editorCursor.foreground': USER.color,
            }
        });
        
        
        monaco.editor.defineTheme('my-vs-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editorCursor.foreground': USER.color,
            }
        });
     
        monaco.editor.defineTheme('my-hc-black', {
            base: 'hc-black',
            inherit: true,
            rules: [],
            colors: {
                'editorCursor.foreground': USER.color,
            }
        });
        editor = monaco.editor.create(document.getElementById('code_editor'));
      
        monaco.editor.setTheme('my-vs')

    
    // Update  and set monaco editor language on change
        $('#language').on('change', function() {
            let language = document.getElementById('language').value;
            monaco.editor.setModelLanguage(editor.getModel(), language);
            });
        $('#theme').on('change', function() {
                let theme = $("#theme").val();
                monaco.editor.setTheme(theme) 
        });
        // Send request to api to get data on specific code tweet. Update the editor to display saved data
        $.ajax({
            url : `/api/tweets/${cid}`,
            type: "GET",
            success: function(result){
                let code = result[0].code.replace(/'/g, "");
                language = result[0].language.replace(/'/g, "");
                let title = result[0].title.replace(/'/g, "");
                USER.label = result[0].username;
                console.log(title);
                $("#language").val(language);
                $('#language').formSelect();
                $("#title").val(title);
                $(document).prop('title', title)
                monaco.editor.setModelLanguage(editor.getModel(), language);
                editor.getModel().setValue(code);
            },
            error: function(error){
                if (error.responseText == 'Unauthorized'){
                     window.location.href = "/tweets";
                     alert(error.responseText)
                }else{
                    alert(error);
                }
            }
        });
        $(function(){
            var socket = io('http://localhost:3000');
            socket.emit('join', location.pathname);
            editor.onKeyUp(function(e) {
                const text = editor.getModel().getValue();
                socket.send({room: location.pathname, message:text})
            });
            socket.on('message', (data) => {
                editor.getModel().setValue(data);
            });
        });

    $(function (){
        
        let url = window.location.href;
        let sub = url.replace('http://localhost:3000/showtweet/', '')
        let cid = parseInt(sub); 
        $("#create_form").on("submit", function(e){
                e.preventDefault();
                // create our object that will store our information for PUT reuest
                var formData = {
                    'code': editor.getModel().getValue().replace(/'/g, '"'),
                    'cid' : parseInt(cid),
                    'language': $('#language').val(),
                    'title': $("#title").val()
                };
                // PUT request to REST API 
                $.ajax({
                    url:   `/api/tweets/${cid}`,
                    type: "PUT",
                    data: JSON.stringify(formData),
                    contentType: 'application/json',
                    dataType: "json",
                    success: function(result){
                        window.location.replace("/tweets"); 
                    },
                    error: function(error){
                        if (error.responseText == "Unauthorized"){
                            window.location.href = "/tweets";
                            alert(error.responseText)
                        }else{
                            alert(error.responseText);
                        }

                    }
        
                });
            });
        })
    });
    });