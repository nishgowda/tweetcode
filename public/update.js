$(document).ready(function(){
    
    let url = window.location.href;
    let sub = url.replace('http://localhost:3000/showtweet/', '')
    let cid = parseInt(sub);
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
    $.ajax({
        url : `/api/tweets/${parseInt(cid)}`,
        type: "GET",
        success: function(result){
            let code = result[0].code;
            language = result[0].language;
            editor.setValue(code);
            text = editor.getValue()
            $('#language').val(language);
            editor.getSession().setMode(`ace/mode/${language.toLowerCase()}`);
        }
    });
    $(function (){
        let url = window.location.href;
        let sub = url.replace('http://localhost:3000/showtweet/', '')
        let cid = parseInt(sub); 
        $("#create_form").on("submit", function(e){
                e.preventDefault();
                var formData = {
                    'code': editor.getValue().replace(/"/g, "'"),
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