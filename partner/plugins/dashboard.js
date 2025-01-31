(function () {
    'use strict'
    feather.replace({ 'aria-hidden': 'true' })
})();
    $('.installModal').on('click', function () {
    var btn = $(this);
    $.post( "install.php", { plugin: $(this).data("plugin-name"), file: $(this).data("plugin-file") })
        .done(function( data ) {
            if(data === "") {
                btn.removeClass("btn-success").removeClass("installModal").addClass("btn-danger").addClass("removeModal").html("Remove");
            }
        });
});
$('.removeModal').on('click', function () {
    var btn = $(this);
    $.post( "remove.php", { id: $(this).data("plugin-id"), plugin: $(this).data("plugin-name") })
        .done(function( data ) {
            if(data === "") {
                btn.removeClass("btn-danger").removeClass("removeModal").addClass("btn-success").addClass("installModal").html("Install");
            }
        });
});
$('.pluginSettingsModal').on('click', function () {
    var button = $(this);
    $('#pluginModal').modal('show');
    $('#pluginModal .modal-title').text($(this).data('plugin-title'));
    var plugin_values = JSON.parse($(this).attr("data-values"));
    $("#pluginModal form").empty().append('<input type="hidden" id="plugin_slug" name="plugin_slug" value="' + $(this).data("plugin-name") + '"/><input type="hidden" id="plugin_id" name="plugin_id" value="' + plugin_values.plugin_id + '"/>');
    $( $(this).data("fields")).each(function(key,value) {
        if(typeof value.standard === 'undefined')
            input_value = "";
        else
            input_value = value.standard;
        if(typeof plugin_values[value.id] !== 'undefined')
            input_value = plugin_values[value.id];
        if(typeof value.type === 'undefined')
            input_type = ["input"];
        else
            input_type = [value.type, value.html];
        $("#pluginModal form").append(plugin_fields(input_type,value.title,value.name,value.id,input_value,value.hidden));
    });
});

function plugin_fields(field_type,text,name,id,value,hidden) {
    var css = "";
    if(typeof hidden !== 'undefined' && hidden === true)
        css = "display:none";
    if(field_type[0] == "html")
        return "<div class=\"form-group\" style='" + css +  "'>" + field_type[1] + "</div>";
    else
        return "<div class=\"form-group\" style='" + css +  "'><label for=\""+id+"\" class=\"col-form-label\">"+text+":</label><input type=\"text\" class=\"form-control\" name=\""+name+"\" id=\""+id+"\" value=\"" + value + "\"></div>";
}
$(".confirmPluginSettngs").on("click", function() {
    $.post( "?", $("#pluginModal form").serialize())
        .done(function( data ) {
            if(data !== "") {
                $("div").find("[data-plugin-id='" + $("#pluginModal form #plugin_slug").val() + "']").find(".pluginSettingsModal").attr("data-values",data);
                $('#pluginModal').modal('hide');
            }
        });
});
$("#pluginSettings").on("submit",function(e) {
    e.preventDefault();
    $(".confirmPluginSettngs").click();
});