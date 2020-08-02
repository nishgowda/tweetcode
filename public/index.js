$(document).ready(function(){

    $.ajax({
        url : "/api/tweets",
        type: "GET",
        success: function(result){
            console.log(result);
            let table = $("#codeTweets");
            for (let i = 0; i < result.length; i ++){
                table.append('<tr><td>' + result[i].username + '</td><td>' + `<a href="/showtweet/${result[i].cid}">View Tweet</a>` +  '</td><td>' +`<a href="/delete/${result[i].cid}">Delete</a>` + '</tr>');
            }
        }
    });


    $(function(){
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

        $('#language').on('change', function() {
            let language = $("#language").val();
            monaco.editor.setModelLanguage(editor.getModel(), language);
            console.log(`model language was changed to ${editor.getModel().getLanguageIdentifier().language}`);
            });
        $('#theme').on('change', function() {
                let theme = $("#theme").val();
                monaco.editor.setTheme(theme);
                });
        
            $("#create_form").on("submit", function(e){
            e.preventDefault();

            var formData = {
                'code': editor.getModel().getValue().replace(/"/g, "'"),
                'language': $('#language').val().toLowerCase()
            };
            console.log(JSON.stringify(formData));
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
                    console.log(error);
                    alert(error.responseText);
                }
            });
           
        });
    })


    


});
});
