$(document).ready(function(){
    
    let url = window.location.href;
    let sub = url.replace('http://localhost:3000/showtweet/', '')
    let cid = parseInt(sub);
    var editor;
    var select = $("#language");
    var langs = ['abap', 'apex', 'azcli', 'bat', 'cameligo', 'clojure', 'coffee', 'cpp', 'csharp', 'csp', 'css', 'dockerfile', 'fsharp', 'go', 'graphql', 'handlebars', 'html', 'ini', 'java', 'javascript', 'json', 'kotlin', 'less', 'lua', 'markdown', 'mips', 'msdax', 'mysql', 'objective-c', 'pascal', 'pascaligo', 'perl', 'pgsql', 'php', 'postiats', 'powerquery', 'powershell', 'pug', 'python', 'r', 'razor', 'redis', 'redshift', 'restructuredtext', 'ruby', 'rust', 'sb', 'scheme', 'scss', 'shell', 'solidity', 'sophia', 'sql', 'st', 'swift', 'tcl', 'twig', 'typescript', 'vb', 'xml', 'yaml'];
    for(var i = 0; i < langs.length; i++) {
        var opt = langs[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.append(el);
    }
    require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }});
    window.MonacoEnvironment = { getWorkerUrl: () => proxy };
    let proxy = URL.createObjectURL(new Blob([`
        self.MonacoEnvironment = {
            baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
        };
        importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
    `], { type: 'text/javascript' }));
    require(["vs/editor/editor.main"], function () {
        editor = monaco.editor.create(document.getElementById('code_editor'));
        $('#language').on('change', function() {
            let language = document.getElementById('language').value;
            monaco.editor.setModelLanguage(editor.getModel(), language);
            console.log(`model language was changed to ${editor.getModel().getLanguageIdentifier().language}`);
            });
        $('#theme').on('change', function() {
                let theme = $("#theme").val();
                monaco.editor.setTheme(theme);
        });
        $.ajax({
            url : `/api/tweets/${cid}`,
            type: "GET",
            success: function(result){
                let code = result[0].code;
                language = result[0].language;
                $("#language").val(language);
                $('#language').formSelect();
                monaco.editor.setModelLanguage(editor.getModel(), language);
                console.log(`model language was changed to ${editor.getModel().getLanguageIdentifier().language}`);
                editor.getModel().setValue(code);
            }
        });
    $(function (){
        let url = window.location.href;
        let sub = url.replace('http://localhost:3000/showtweet/', '')
        let cid = parseInt(sub); 
        $("#create_form").on("submit", function(e){
                e.preventDefault();
                var formData = {
                    'code': editor.getModel().getValue().replace(/"/g, "'"),
                    'cid' : parseInt(cid),
                    'language': $('#language').val()
                };
                console.log(formData);
                $.ajax({
                    url:   `/api/tweets/${parseInt(cid)}`,
                    type: "PUT",
                    data: JSON.stringify(formData),
                    contentType: 'application/json',
                    dataType: "json",
                    success: function(result){
                        window.location.replace("/tweets"); 
                    },
                    error: function(error){
                        console.log(error);
                        alert(error.responseText);
                    }
        
                });
            });
        })
    });
    });