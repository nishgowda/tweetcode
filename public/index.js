$(document).ready(function(){
    
    $.ajax({
        url : "/api/tweets",
        type: "GET",
        success: function(result){
            let table = $("#codeTweets");
            for (let i = 0; i < result.length; i ++){
                table.append('<tr><td>' + result[i].username + '</td><td>' + `<a href="/showtweet/${result[i].cid}">View Tweet</a>` +  '</td><td>' +`<a href="/delete/${result[i].cid}">Delete</a>` + '</tr>');
            }
        }
    });


    $(function(){
        var editor = ace.edit("code_editor");
        editor.setTheme("ace/theme/monokai");
        var select = document.getElementById("language");
        var langs = ['ABAP','ABC','ActionScript', 'ADA', 'Apache_Conf','AsciiDoc','Assembly_x86','AutoHotKey',
        'C9Search','C_Cpp','Cirru','Clojure','Cobol','coffee','ColdFusion','CSharp','CSS','Curly','D','Dart','Diff','Dockerfile','Dot','Dummy','DummySyntax','Eiffel','EJS','Elixir','Elm','Erlang','Forth','FTL','Gcode','Gherkin','Gitignore','Glsl','golang','Groovy','HAML','Handlebars','Haskell','haXe','HTML','HTML_Ruby','INI','Io','Jack','Jade','Java','JavaScript','JSON','JSONiq','JSP','JSX','Julia','LaTeX','LESS','Liquid','Lisp','LiveScript','LogiQL','LSL','Lua','LuaPage','Lucene','Makefile','Markdown','Mask','MATLAB','MEL','MUSHCode','MySQL','Nix','ObjectiveC','OCaml','Pascal','Perl','pgSQL','PHP','Powershell','Praat','Prolog','Properties','Protobuf','Python','R','RDoc','RHTML','Ruby','Rust','SASS','SCAD','Scala','Scheme','SCSS','SH','SJS','Smarty','snippets','Soy_Template','Space','SQL','Stylus','SVG','Tcl','Tex','Text','Textile','Toml','Twig','Typescript','Vala','VBScript','Velocity','Verilog','VHDL','XML','XQuery','YAML']
        for(var i = 0; i < langs.length; i++) {
            var opt = langs[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
        $('#language').on('change', function() {
            let language = $("#language").val().toLowerCase();
            editor.getSession().setMode(`ace/mode/${language}`);
            
            });
            document.getElementById("code_editor").style.height = "700px";
            document.getElementById("code_editor").style.width = "1000px";
        
            $("#create_form").on("submit", function(e){
            e.preventDefault();

            var formData = {
                'code': editor.getValue().replace(/"/g, "'"),
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
