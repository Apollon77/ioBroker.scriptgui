var scripts = {
    blocklyWorkspace : null,
    blocklyCode2JSCode :  function(oneWay, justConvert) {
        var code = Blockly.JavaScript.workspaceToCode(scripts.blocklyWorkspace);
        if (!oneWay) {
            code += '\n';
            var dom = Blockly.Xml.workspaceToDom(scripts.blocklyWorkspace);
            var text = Blockly.Xml.domToText(dom);
            code += '//' + btoa(encodeURIComponent(text));
        }

        if (!justConvert) that.editor.setValue(code, -1);
        return code;
    },
    jsCode2Blockly: function (text) {
        text = text || '';
        var lines = text.split(/[\r\n|\r|\n]+/g);
        var xml = '';
        for (var l = lines.length - 1; l >= 0; l--) {
            if (lines[l].substring(0, 2) === '//') {
                xml = lines[l].substring(2);
                break;
            }
        }
        if (xml.substring(0, 4) === '<xml') {
            return xml;
        } else {
            var code;
            try {
                code = decodeURIComponent(atob(xml));
            } catch (e) {
                code = null;
                console.error('cannot decode: ' + xml);
                console.error(e);
            }
            return code;
        }
    },
};



var systemLang = "de";
jQuery.extend(true, SGI, {
    load_blockly: function (callback) {

        // MSG.catSystem = Blockly.Words['System']["de"];
        // MSG.catSendto = Blockly.Words['Sendto']["de"];

        // console.log(MSG)
        //scripts = scripts;

        var fileLang = document.createElement('script');
        fileLang.setAttribute('type', 'text/javascript');
        fileLang.setAttribute('src', '../javascript.admin/google-blockly/msg/js/' + (systemLang || 'en') + '.js');
        // most browsers
        fileLang.onload = function () {
            scripts.languageLoaded = true;
        };
        // IE 6 & 7
        fileLang.onreadystatechange = function () {
            if (this.readyState === 'complete') {
                scripts.languageLoaded = true;
            }
        };
        document.getElementsByTagName('head')[0].appendChild(fileLang);

        var fileCustom = document.createElement('script');
        fileCustom.setAttribute('type', 'text/javascript');
        fileCustom.setAttribute('src', '../javascript.admin/google-blockly/own/msg/' + (systemLang || 'en') + '.js');
        // most browsers
        fileCustom.onload = function () {
            scripts.languageLoaded = true;
        };
        // IE 6 & 7
        fileCustom.onreadystatechange = function () {
            if (this.readyState === 'complete') {
                scripts.languageLoaded = true;
            }
        };
        document.getElementsByTagName('head')[0].appendChild(fileCustom);


        $("#blockly_style").load("../javascript.admin/tab.html style", function (data, textStatus, jqxhr) {
        });
        //$("#blockly_functions").load( "../javascript.admin/scripts.js" , function( data, textStatus, jqxhr ){
        //    console.log(scripts)
        //});
        $("#blockly_toolbox").load("../javascript.admin/tab.html #toolbox", function (data, textStatus, jqxhr) {

            setTimeout(function () {
            var toolboxText = document.getElementById('toolbox').outerHTML;
            toolboxText = toolboxText.replace(/{(\w+)}/g,
                function(m, p1) {

                    console.log(MSG)
                    console.log(p1)
                    console.log(MSG[p1])
                    return MSG[p1]});
            toolboxText = toolboxText
            var blocks = '';
            for (var cb = 0; cb < Blockly.CustomBlocks.length; cb++) {
                var name = Blockly.CustomBlocks[cb];
                // add blocks
                blocks += '<category name="' + Blockly.Words[name]["de"] + '" colour="' + Blockly[name].HUE + '">';
                for (var _b in Blockly[name].blocks) {
                    blocks += Blockly[name].blocks[_b];
                }
                blocks += '</category>';
            }
            toolboxText = toolboxText.replace('<category><block>%%CUSTOM_BLOCKS%%</block></category>', blocks);




            var toolboxXml = Blockly.Xml.textToDom(toolboxText);
            scripts.blocklyWorkspace = Blockly.inject(
                'main_blockly',
                {
                    media: '../javascript.admin/google-blockly/media/',
                    toolbox: toolboxXml,
                    zoom: {
                        controls: true,
                        wheel: false,
                        startScale: 1.0,
                        maxScale: 3,
                        minScale: 0.3,
                        scaleSpeed: 1.2
                    },
                    trashcan: true,
                    grid: {
                        spacing: 25,
                        length: 3,
                        colour: '#ccc',
                        snap: true
                    }
                }
            );
            SGI.blockly_rendered = true;
            $(".blocklyToolboxDiv").addClass("frame_color ui-state-default");


            },0)

            setTimeout(function () {
                callback()
            },0)



        });



    },
    show_blockly: function (cb) {

        function show(){
            $("#logo").hide();
            SGI.hide_gui();
            SGI.hide_editor();

            SGI.setMain();

            SGI.mode = "blockly";
            scope.setup.mode = "blockly";
            scope.$apply();

            $("#main_blockly").show();

            Blockly.svgResize(scripts.blocklyWorkspace)
        }

        if (!SGI.blockly_rendered) {
            SGI.load_blockly(function(){
                show()
                cb();
            })
        }else{
            $(".blocklyWidgetDiv").show();
            $(".blocklyTooltipDiv").show();
            $(".blocklyToolboxDiv").show();
            show()
            cb()
        }
    },
    hide_blockly: function () {
        //$("#main_editor").hide();
        //$(".set_editor").hide();

        $(".blocklyWidgetDiv").hide();
        $(".blocklyTooltipDiv").hide();
        $(".blocklyToolboxDiv").hide();
    },



});
