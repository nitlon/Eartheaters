//var shape_tags = ['arrow', 'circle', 'line', 'path', 'pathC', 'point', 'polygon', 'text'];
var shape_tags = ['circle', 'image', 'line', 'text', 'path', 'point'];
var shape_names = firstToUpperCase(shape_tags);
//var shape_transform = addC(shape_tags, 's').concat(['pointsAnimate']);
var shape_transform = addC(shape_tags, 's').concat(addC(shape_tags, 'sAnimate'));

// Create global arrays for shapes
for (var i = 0, len = shape_tags.length; i < len; i++){
	eval(shape_tags[i] + 's = new Array();');
	eval(shape_tags[i] + 'sAttributes = new Array();');
	eval(shape_tags[i] + 'sAnimate = new Array();');
	eval(shape_tags[i] + 'sAnimateI = [];');
	eval(shape_tags[i] + 'sAttributesAnimate = new Array();');
	eval('var ' + shape_tags[i] + 's_animate;');
}

pathCs = new Array();
pathCsAttributes = new Array();
pathCsAttributesAnimate = new Array();

ZOrders = new Array();
Layers = new Array();

var zoom = 280;
var maxzoom = -200;
var frame_adv = 1;
var eyez = 300;
var depth = Math.floor(zoom * (eyez - maxzoom) / 100 + eyez);

var shape_properties = [
	'x', 'y', 'z', 
	'x1', 'y1', 'z1', 'x2', 'y2', 'z2', 
	'cx', 'cy', 'cz',
	'h', 'w'
];

var attribute_properties = [
	'r', 'fill', 'stroke', 'fill_opacity', 'stroke_opacity', 'opacity', 'stroke_width', 
	'z_index', 'text_anchor', 'font_size', 'font_family', 'font_style', 
	'font_weight', 'letter_spacing', 'writing_mode', 'glyph_orientation_vertical', 
	'src', 'preserveAspectRatio'
];

var properties = shape_properties.concat(attribute_properties);
var opacity_types = ['opacity', 'stroke_opacity', 'fill_opacity'];
var rotate_mode = true;

var animation_length = 0;
var frame_width = 10;
var object_name = 'shape_viewer_3d';
var max_arrowhead_size = 15;

view_box = new Array();
window_properties = new Array();

var set_key_event_calls = 0;

var anim_n = 0;
var arrow_angle = 25;
var currentEvent = "nothing";
var globalkeypress = '';
var IE = document.all ? true : false
var initiate = 0;
var zoom_speed = 5;
var sort_shapes = 0;
var stop_anim = 0;
var svgns = "http://www.w3.org/2000/svg";
var tempX = 0;
var tempY = 0;
var mousedown = 0;
var control_panel_visible = true;

var point_color_r = 100;
var point_color_g = 0;
var point_color_b = 0;
var point_opacity = 0.5;
var point_radius = 4;

var line_color_r = 0;
var line_color_g = 0;
var line_color_b = 0;
var line_width = 1;
var line_opacity = 1;

var prevX, prevY;
var ajax_output;

test_array = new Array();

zindex = new Array();
points_i_to_k = new Array();
RefPoints = new Array();
Shapes = new Array();
Textlinks = new Array();

AnimatePoints = new Array();
AnimateArrows = new Array();
AnimateLines = new Array();

Translate = new Array();
Rotate = new Array();

function animateShapes(anim_frame){

	var i, j, k, len, len_i, len_j;
	var shape;
	var anim_n_i = anim_n;

	// If animation frame is undefined
	if(anim_frame == undefined){

		// If no animation reverse, reset frame number to zero at end
		if(!animation_reverse){
			if(anim_n >= animation_length || anim_n <= 0){
				anim_n = 0;
				frame_adv = 1;
			}
		}

		// If animation reverse is true reverse direction of frame count
		if(animation_reverse){
			if(anim_n <= 0) frame_adv = 1
			if(anim_n >= animation_length){
				anim_n = animation_length-1;
				frame_adv = -1;
			}
		}
	
		// INCREASE ANIMATION REPEAT COUNT
		if(anim_n < anim_n_i) animation_count++

	}else{

		// Check that frame number is greater than zero
		if(anim_frame < 0) var anim_frame = 0;

		// Check that frame number does not exceed animation length
		if(anim_frame >= animation_length) var anim_frame = animation_length-1;
		
		anim_n = anim_frame;
	}

	// IF MAXIMUM NUMBER OF REPEATS IS REACHED, STOP ANIMATION
	if(animation_repeat > -1 && animation_count > animation_repeat){
		clearInterval(intervalID);
		return;
	}

	// alert('Frame number: ' + anim_n + '\n' + 'Number of repeats: ' + animation_count)

	// ANIMATE SHAPES
	if(circles_animate){
		for(i = 0, len = circlesAnimate.length;i < len; i++){
			circles[circlesAnimateI[i]].x = circlesAnimate[i].x[anim_n];
			circles[circlesAnimateI[i]].y = circlesAnimate[i].y[anim_n];
			circles[circlesAnimateI[i]].z = circlesAnimate[i].z[anim_n];
			circles[circlesAnimateI[i]].r = circlesAnimate[i].r[anim_n];
		}
	}

	if(images_animate){
		for(i = 0, len = imagesAnimate.length;i < len; i++){
			images[imagesAnimateI[i]].x1 = imagesAnimate[i].x1[anim_n];
			images[imagesAnimateI[i]].y1 = imagesAnimate[i].y1[anim_n];
			images[imagesAnimateI[i]].z1 = imagesAnimate[i].z1[anim_n];
			images[imagesAnimateI[i]].x2 = imagesAnimate[i].x2[anim_n];
			images[imagesAnimateI[i]].y2 = imagesAnimate[i].y2[anim_n];
			images[imagesAnimateI[i]].z2 = imagesAnimate[i].z2[anim_n];
		}
	}

	if(lines_animate){
		for(i = 0, len = linesAnimate.length;i < len; i++){
			lines[linesAnimateI[i]].x1 = linesAnimate[i].x1[anim_n];
			lines[linesAnimateI[i]].y1 = linesAnimate[i].y1[anim_n];
			lines[linesAnimateI[i]].z1 = linesAnimate[i].z1[anim_n];
			lines[linesAnimateI[i]].x2 = linesAnimate[i].x2[anim_n];
			lines[linesAnimateI[i]].y2 = linesAnimate[i].y2[anim_n];
			lines[linesAnimateI[i]].z2 = linesAnimate[i].z2[anim_n];
		}
	}

	if(points_animate){
		for(i = 0, len = pointsAnimate.length;i < len; i++){
			points[pointsAnimateI[i]].x = pointsAnimate[i].x[anim_n];
			points[pointsAnimateI[i]].y = pointsAnimate[i].y[anim_n];
			points[pointsAnimateI[i]].z = pointsAnimate[i].z[anim_n];
		}
	}

	if(texts_animate){
		for(i = 0, len = textsAnimate.length;i < len; i++){
			texts[textsAnimateI[i]].x = textsAnimate[i].x[anim_n];
			texts[textsAnimateI[i]].y = textsAnimate[i].y[anim_n];
			texts[textsAnimateI[i]].z = textsAnimate[i].z[anim_n];
			texts[textsAnimateI[i]].s = textsAnimate[i].s[anim_n];
		}
	}

	// ANIMATE ATTRIBUTES

	if(circles_attributes_animate){

		for(i = 0, len_i = circlesAttributesAnimate.length;i < len_i; i++){
			for(j = 0, len_j = attribute_properties.length;j < len_j; j++){

				if(circlesAttributesAnimate[i][attribute_properties[j]] == null) continue

				circlesAttributes[circlesAttributesAnimate[i].i][attribute_properties[j]] = 
					circlesAttributesAnimate[i][attribute_properties[j]][anim_n];
			}

			shape = svgDocument.getElementById('circle' + circlesAttributesAnimate[i].i);
			shape.setAttribute("style", attributesToString(circlesAttributes[circlesAttributesAnimate[i].i]));
		}
	}

	if(images_attributes_animate){

		for(i = 0, len_i = imagesAttributesAnimate.length;i < len_i; i++){
			for(j = 0, len_j = attribute_properties.length;j < len_j; j++){

				if(imagesAttributesAnimate[i][attribute_properties[j]] == null) continue

				imagesAttributes[imagesAttributesAnimate[i].i][attribute_properties[j]] = 
					imagesAttributesAnimate[i][attribute_properties[j]][anim_n];
			}

			shape = svgDocument.getElementById('image' + imagesAttributesAnimate[i].i);
			shape.setAttribute("style", attributesToString(imagesAttributes[imagesAttributesAnimate[i].i]));
		}
	}

	if(lines_attributes_animate){

		for(i = 0, len_i = linesAttributesAnimate.length;i < len_i; i++){
			for(j = 0, len_j = attribute_properties.length;j < len_j; j++){

				if(linesAttributesAnimate[i][attribute_properties[j]] == null) continue

				linesAttributes[linesAttributesAnimate[i].i][attribute_properties[j]] = 
					linesAttributesAnimate[i][attribute_properties[j]][anim_n];
			}

			shape = svgDocument.getElementById('line' + linesAttributesAnimate[i].i);
			shape.setAttribute("style", attributesToString(linesAttributes[linesAttributesAnimate[i].i]));
		}
	}

	if(points_attributes_animate){

		for(i = 0, len_i = pointsAttributesAnimate.length;i < len_i; i++){
			for(j = 0, len_j = attribute_properties.length;j < len_j; j++){

				if(pointsAttributesAnimate[i][attribute_properties[j]] == null) continue

				pointsAttributes[pointsAttributesAnimate[i].i][attribute_properties[j]] = 
					pointsAttributesAnimate[i][attribute_properties[j]][anim_n];
			}

			shape = svgDocument.getElementById('point' + pointsAttributesAnimate[i].i);
			shape.setAttribute("style", attributesToString(pointsAttributes[pointsAttributesAnimate[i].i]));
			shape.setAttribute("r", pointsAttributesAnimate[i].r[anim_n]);
		}
	}

	if(texts_attributes_animate){

		for(i = 0, len_i = textsAttributesAnimate.length;i < len_i; i++){
			for(j = 0, len_j = attribute_properties.length;j < len_j; j++){

				if(textsAttributesAnimate[i][attribute_properties[j]] == null) continue

				textsAttributes[textsAttributesAnimate[i].i][attribute_properties[j]] = 
					textsAttributesAnimate[i][attribute_properties[j]][anim_n];
			}

			shape = svgDocument.getElementById('text' + textsAttributesAnimate[i].i);
			shape.setAttribute("style", attributesToString(textsAttributes[textsAttributesAnimate[i].i]));
		}
	}

	// Update animation controls
	var frame_input =document.getElementById('animation_frame_count_input');

	// Check that frame controls are present
	if(frame_input !== null){

		// Add frame count to animation frame input
		document.getElementById('animation_frame_count_input').value = (anim_n+1);

		// Update slider position
		document.getElementById('animation_frame_range_input').value = Math.round(((anim_n) / (animation_length-1))*100);
	}

	anim_n = anim_n + frame_adv;
	updateShapes();

	return;
}

function applyCookies(){

	var cookies = listCookies();

	for (i = 0; i < cookies.length; i++) {

		if(cookies[i].value == undefined) continue;

		// Call function call cookies using eval
		if(cookies[i].value == 'eval') eval(cookies[i].name);
	}
}

function changeLayerOpacity(layer, opacity){

	var i, j, len, len_j;
	var match;
	var shape;
	var opacity_i, stroke_opacity_i, fill_opacity_i;
	var animate_idx;

	// Add shapes to SVG document
	for (i = 0, len = Layers.length; i < len; i++) {

		match = false;
		
		if(Layers[i].layer.length == 1){
			
			if(Layers[i].layer == layer) match = true;

		}else{
			for (j = 0, len_j = Layers[i].layer.length; j < len_j; j++) if(Layers[i].layer[j] == layer) match = true;
		}

		if(!match) continue;
		
		var opacity_i;
		var stroke_opacity_i;
		var fill_opacity_i;
		var opacity_animate_i;
		var stroke_opacity_animate_i;
		var fill_opacity_animate_i;

		for (j = 0, len_j = opacity_types.length; j < len_j; j++){

			eval(opacity_types[j] + '_i = ' + Layers[i].type + 'sAttributes[' + Layers[i].i 
				+ '].' + opacity_types[j] + ';')

			eval('if(' + opacity_types[j] + '_i !== undefined){' + Layers[i].type + 
				'sAttributes[' + Layers[i].i + '].' + opacity_types[j] + ' = ' + opacity + ';' + 
				'shape = svgDocument.getElementById(Layers[i].type + Layers[i].i);' + 
				'shape.setAttribute("style", attributesToString(' + Layers[i].type + 
				'sAttributes[' + Layers[i].i + ']));}');
		}

		if(Layers[i].type !== 'path'){

			eval('animate_idx = ' + Layers[i].type + 'sAttributes[' + Layers[i].i + '].animate');

			if(animate_idx !== null){
				for (j = 0, len_j = opacity_types.length; j < len_j; j++){

					eval(opacity_types[j] + '_i = ' + Layers[i].type + 'sAttributesAnimate[' + animate_idx 
						+ '].' + opacity_types[j] + ';')

					eval('if(' + opacity_types[j] + '_i !== undefined && ' + opacity_types[j] + 
						'_i !== null){' + Layers[i].type + 'sAttributesAnimate[' + animate_idx 
						+ '].' + opacity_types[j] + ' = null;}');
				}
			}
		}
	}
}

function fitShapesToWindow(){

	var i;
	var len;
	var shape_limits;
	var xmin = [], xmax = [], ymin = [], ymax = [], zmin = [], zmax = [];

	// Get coordinate limits in space
	for (i = 0, len = shape_transform.length; i < len; i++){

		// Get limits for each shape
		eval('shape_limits = limits(' + shape_transform[i] + ');');

		if(shape_limits.xmin == undefined) continue;
		if(shape_limits.xmin == -Infinity) continue;
		if(isNaN(shape_limits.xmin)) continue;

		// Add limits to array
		xmin.push(shape_limits.xmin);
		xmax.push(shape_limits.xmax);
		ymin.push(shape_limits.ymin);
		ymax.push(shape_limits.ymax);
		zmin.push(shape_limits.zmin);
		zmax.push(shape_limits.zmax);
	}

	// Remove NaN and Infinity values
	xmin = clean(xmin, NaN);
	xmin = clean(xmin, Infinity);
	xmax = clean(xmax, NaN);
	xmax = clean(xmax, Infinity);
	ymin = clean(ymin, NaN);
	ymin = clean(ymin, Infinity);
	ymax = clean(ymax, NaN);
	ymax = clean(ymax, Infinity);
	zmin = clean(zmin, NaN);
	zmin = clean(zmin, Infinity);
	zmax = clean(zmax, NaN);
	zmax = clean(zmax, Infinity);

	// Find ranges for all shapes
	xmin = min.apply(Math, xmin);
	ymin = min.apply(Math, ymin);
	zmin = min.apply(Math, zmin);

	// Find ranges for all shapes
	xmax = max.apply(Math, xmax);
	ymax = max.apply(Math, ymax);
	zmax = max.apply(Math, zmax);

	// Find ranges
	var x_range = xmax - xmin;
	var y_range = ymax - ymin;
	var z_range = zmax - zmin;

	// Replace any zero ranges with maximum range
	var max_range = max.apply(Math, [x_range, y_range, z_range]);
	if(x_range == 0) x_range = max_range
	if(y_range == 0) y_range = max_range
	//if(z_range == 0) z_range = max_range
	
	// Get window dimensions
	if(z_range == 0){
		var view_width = getWindowWidth() - 5*margin;
		var view_height = getWindowHeight() - 5*margin;
	}else{
		var view_width = getWindowWidth() - 2*margin;
		var view_height = getWindowHeight() - 2*margin;
	}
	
	// Find projection factor
	var u = -(depth - eyez) / ((z_range / 2) - eyez);

	// Solve for scaling based on fit within each dimension
	var scale_from_width = ((view_width / 2) - margin) / ((x_range / 2) * u)
	var scale_from_height = ((view_height / 2) - margin) / ((y_range / 2) * u)

	// Find max in each dimension from scaling based on opposite dimension
	var xmax_from_height = (x_range / 2)*scale_from_height*u + margin
	var xmax_from_width = (x_range / 2)*scale_from_width*u + margin

	// Determine which scaling places all shapes within view
	if(Math.abs(xmax_from_height) <= (view_width/2)){
		var scaling = scale_from_height
	}else{
		var scaling = scale_from_width
	}

	//var ymax_from_height = (y_range / 2)*scale_from_height*u + margin
	//var ymax_from_width = (y_range / 2)*scale_from_width*u + margin
	//alert('scale_from_height:' + (view_width/2) + ', ' + (view_height/2) + '; ' + scale_from_height + ', ' + xmax_from_height + ', ' + ymax_from_height)
	//alert('scale_from_width:' + (view_width/2) + ', ' + (view_height/2) + '; ' + scale_from_width + ', ' + xmax_from_width + ', ' + ymax_from_width)

	// Find center
	var center = [(xmin + x_range/2), (ymin + y_range/2), (zmin + z_range/2)];

	// Center all shapes
	for (i = 0, len = shape_transform.length; i < len; i++) eval('translate(' + shape_transform[i] + ', ' + -center[0] + ', ' + -center[1] + ', ' + -center[2] + ')');

	// Scale all shapes
	for (i = 0, len = shape_transform.length; i < len; i++) eval('scale(' + shape_transform[i] + ', ' + scaling + ')');

	return;
}

function getMouseMoveXY(e){

	if(initiate == 0){
		prevX = initialX;
		prevY = initialY;
	}
	initiate = 1;

	if(IE){
		tempX = e.clientX + document.body.scrollLeft;
		tempY = e.clientY + document.body.scrollTop;
	}else{
		tempX = e.pageX;
		tempY = e.pageY;
	}  

	if (tempX < 0){tempX = 0;}
	if (tempY < 0){tempY = 0;}  

	if(mousedown == 1 && globalkeypress == ''){

		distX = tempX - prevX;
		distY = prevY - tempY;
		
		if(distX !== 0){setKeyEvent("translateX", distX/4.667);}  // manually calibrated
		if(distY !== 0){setKeyEvent("translateY", distY/4.667);}
	}
	if(mousedown == 1 && (globalkeypress == 'r' || rotate_mode == true)){
		distX = tempX - prevX;
		distY = prevY - tempY;
		
		if(distX !== 0){setKeyEvent("rotateYaxis", -distX);}
		if(distY !== 0){setKeyEvent("rotateXaxis", distY);}
	}

	prevX = tempX
	prevY = tempY

	return false;
}

function get_transformations(){

	if(document.getElementsByTagName("transformation").length){
		for(i = 0;i < document.getElementsByTagName("transformation").length;i++){

			var svg_elem = document.getElementsByTagName("transformation")[i];

			// SET TRANSLATE ARRAY
			if(svg_elem.getAttribute("translate") !== null) Translate = Translate.concat(string_to_array_cs(svg_elem.getAttribute("translate")))

			// SET ROTATE ARRAY
			if(svg_elem.getAttribute("rotate") !== null) Rotate = Rotate.concat(string_to_array_cs(svg_elem.getAttribute("rotate")))
		}
	}
}

function getShapes(){

	var i, j, k;
	var len_j, len_k;
	var shape_tag;
	var doc_shapes;
	var doc_shapes_len;
	var property_name;
	var attributes_animate;

	// ADD LINESC TO SHAPES FOR LOCAL USE ONLY
	var shape_tags_loc = shape_tags.slice();
	shape_tags_loc.push('pathC');

	for(i = 0; i < shape_tags_loc.length; i++){
	
		shape_tag = shape_tags_loc[i];
		if(shape_tag == 'image') shape_tag = 'img';
		
		doc_shapes = document.getElementsByTagName(shape_tag)

		if(!doc_shapes.length) continue;

		for(j = 0, len_j = doc_shapes.length;j < len_j; j++){

			// Clear property variables
			for(k = 0, len_k = properties.length;k < len_k; k++)
				eval("var " + properties[k] + " = null;var " + properties[k] + "_init = null;");

			// SET SHAPE PROPERTIES
			for(k = 0, len_k = shape_properties.length;k < len_k; k++){

				property_name = shape_properties[k].replace(/_/g, '-')

				if(doc_shapes[j].getAttribute(property_name) == null) continue;
				
				if(doc_shapes[j].getAttribute(property_name).indexOf(',') > -1){
					eval(shape_properties[k] + " = doc_shapes[j].getAttribute(\"" + property_name + "\").split(\",\");");
					eval("animation_length = " + shape_properties[k] + ".length;");
					eval(shape_properties[k] + "_init = " + shape_properties[k] + "[0]");
				}else{
					eval(shape_properties[k] + "_init = doc_shapes[j].getAttribute(\"" + property_name + "\");");
					eval(shape_properties[k] + " = null");
				}
			}

			// Set attribute properties
			attributes_animate = false;
			for(k = 0, len_k = attribute_properties.length;k < len_k; k++){

				property_name = attribute_properties[k].replace(/_/g, '-')

				if(doc_shapes[j].getAttribute(property_name) == null) continue;

				if(doc_shapes[j].getAttribute(property_name).indexOf(',') > -1 && property_name !== 'src'){
					eval(attribute_properties[k] + " = doc_shapes[j].getAttribute(\"" + property_name + "\").split(\",\");");
					eval("animation_length = " + attribute_properties[k] + ".length;");
					eval(attribute_properties[k] + "_init = " + attribute_properties[k] + "[0]");
					attributes_animate = true;
				}else{
					eval(attribute_properties[k] + "_init = doc_shapes[j].getAttribute(\"" + property_name + "\");");
					eval(attribute_properties[k] + " = null");
				}
			}

			if(shape_tags_loc[i] == 'circle'){

				circles[j] = new circle(parseFloat(cx_init), parseFloat(cy_init), parseFloat(cz_init), parseFloat(r_init));

				// Multiple center coordinates given but only single radius, replicate to same length
				if(cx !== null && r == null){
					r = Array.apply(null, new Array(cx.length)).map(String.prototype.valueOf, r_init);
				}

				// Multiple radii given but only single center coordinate, replicate to same length
				if(cx == null && r !== null){
					cx = Array.apply(null, new Array(r.length)).map(String.prototype.valueOf, cx_init);
					cy = Array.apply(null, new Array(r.length)).map(String.prototype.valueOf, cy_init);
					cz = Array.apply(null, new Array(r.length)).map(String.prototype.valueOf, cz_init);
				}

				if(cx !== null){
					circlesAnimate[circlesAnimate.length] = new circleAnimate(
						cx.map(parseFloat), cy.map(parseFloat), cz.map(parseFloat), r.map(parseFloat)
					);
					circlesAnimateI.push(j);
				}

				circlesAttributes[j] = new shapeAttributes(
					(!fill_init ? "none" : fill_init),
					(!fill_opacity_init ? 1 : fill_opacity_init),
					(!stroke_init ? "black" : stroke_init),
					(!stroke_opacity_init ? 1 : stroke_opacity_init),
					(!stroke_width_init ? 1 : stroke_width_init),
					'',
					(!z_index_init ? 0 : z_index_init),
					(!attributes_animate ? null : circlesAttributesAnimate.length)
				);

				if(attributes_animate){
					circlesAttributesAnimate[circlesAttributesAnimate.length] = 
						new shapeAttributesAnimate(j, fill, fill_opacity, stroke, 
						stroke_opacity, stroke_width, r, z_index
					);
				}
			}

			if(shape_tags_loc[i] == 'image'){

				images[j] = new line(
					parseFloat(x1_init), parseFloat(y1_init), parseFloat(z1_init), 
					parseFloat(x2_init), parseFloat(y2_init), parseFloat(z2_init));

				if(x1 !== null){
					imagesAnimate[imagesAnimate.length] = new lineAnimate(
						x1.map(parseFloat), y1.map(parseFloat), z1.map(parseFloat), 
						x2.map(parseFloat), y2.map(parseFloat), z2.map(parseFloat)
					);
					imagesAnimateI.push(j);
				}

				imagesAttributes[j] = new imageAttributes(
					(!src_init ? 0 : src_init),
					(!preserveAspectRatio_init ? 'none' : preserveAspectRatio_init),
					(!opacity_init ? 1 : opacity_init),
					(!z_index_init ? 0 : z_index_init),
					(!attributes_animate ? null : imagesAttributesAnimate.length)
				);

				if(attributes_animate){
					imagesAttributesAnimate[imagesAttributesAnimate.length] = 
						new imageAttributesAnimate(j, src, preserveAspectRatio, opacity, z_index);
				}
			}

			if(shape_tags_loc[i] == 'line'){

				lines[j] = new line(
					parseFloat(x1_init), parseFloat(y1_init), parseFloat(z1_init), 
					parseFloat(x2_init), parseFloat(y2_init), parseFloat(z2_init));

				if(x1 !== null){
					linesAnimate[linesAnimate.length] = new lineAnimate(
						x1.map(parseFloat), y1.map(parseFloat), z1.map(parseFloat), 
						x2.map(parseFloat), y2.map(parseFloat), z2.map(parseFloat)
					);
					linesAnimateI.push(j);
				}

				linesAttributes[j] = new shapeAttributes(
					"none",
					"none",
					(!stroke_init ? "black" : stroke_init),
					(!stroke_opacity_init ? 1 : stroke_opacity_init),
					(!stroke_width_init ? 1 : stroke_width_init),
					'',
					(!z_index_init ? 0 : z_index_init),
					(!attributes_animate ? null : linesAttributesAnimate.length)
				);

				if(attributes_animate){
					linesAttributesAnimate[linesAttributesAnimate.length] = 
						new shapeAttributesAnimate(j, fill, fill_opacity, stroke, 
						stroke_opacity, stroke_width, r, z_index
					);
				}
			}

			if(shape_tags_loc[i] == 'pathC'){
				
				pathCs[j] = doc_shapes[j].getAttribute("d").split(",");

				pathCsAttributes[j] = new shapeAttributes(
					(!fill_init ? "none" : fill_init),
					(!fill_opacity_init ? 1 : fill_opacity_init),
					(!stroke_init ? "black" : stroke_init),
					(!stroke_opacity_init ? 1 : stroke_opacity_init),
					(!stroke_width_init ? 1 : stroke_width_init),
					'',
					(!z_index_init ? 0 : z_index_init),
					(!attributes_animate ? null : pathCsAttributesAnimate.length)
				);

				if(attributes_animate){
					pathCsAttributesAnimate[pathCsAttributesAnimate.length] = 
						new shapeAttributesAnimate(j, fill, fill_opacity, stroke, 
						stroke_opacity, stroke_width, r, z_index
					);
				}
			}

			if(shape_tags_loc[i] == 'path'){

				paths[j] = parseSVGPath(doc_shapes[j].getAttribute("d"))

				pathsAttributes[j] = new shapeAttributes(
					(!fill_init ? "none" : fill_init),
					(!fill_opacity_init ? 1 : fill_opacity_init),
					(!stroke_init ? "black" : stroke_init),
					(!stroke_opacity_init ? 1 : stroke_opacity_init),
					(!stroke_width_init ? 1 : stroke_width_init),
					'',
					(!z_index_init ? 0 : z_index_init),
					null
				);
			}

			if(shape_tags_loc[i] == 'point'){

				if(x !== null){
					pointsAnimate[pointsAnimate.length] = new pointAnimate(x.map(parseFloat), y.map(parseFloat), z.map(parseFloat));
					pointsAnimateI.push(j);
				}

				points[j] = new point(parseFloat(x_init), parseFloat(y_init), parseFloat(z_init));

				pointsAttributes[j] = new shapeAttributes(
					(!fill_init ? "none" : fill_init),
					(!fill_opacity_init ? 1 : fill_opacity_init),
					(!stroke_init ? "black" : stroke_init),
					(!stroke_opacity_init ? 1 : stroke_opacity_init),
					(!stroke_width_init ? 1 : stroke_width_init),
					(!r_init ? 1 : r_init),
					(!z_index_init ? 0 : z_index_init),
					(!attributes_animate ? null : pointsAttributesAnimate.length)
				);

				if(attributes_animate){
					pointsAttributesAnimate[pointsAttributesAnimate.length] = 
						new shapeAttributesAnimate(j, fill, fill_opacity, stroke, 
						stroke_opacity, stroke_width, r, z_index);
				}
			}

			if(shape_tags_loc[i] == 'text'){

				// Multiple coordinates given but only single font size, replicate to same length
				if(x !== null && font_size == null){
					font_size = Array.apply(null, new Array(x.length)).map(String.prototype.valueOf, font_size_init);
				}

				// Multiple font sizes given but only single coordinate, replicate to same length
				if(x == null && font_size !== null){
					x = Array.apply(null, new Array(font_size.length)).map(String.prototype.valueOf, x_init);
					y = Array.apply(null, new Array(font_size.length)).map(String.prototype.valueOf, y_init);
					z = Array.apply(null, new Array(font_size.length)).map(String.prototype.valueOf, z_init);
				}

				if(x !== null){
					textsAnimate[textsAnimate.length] = new textAnimate(x.map(parseFloat), y.map(parseFloat), z.map(parseFloat), font_size.map(parseFloat));
					textsAnimateI.push(j);
				}

				texts[j] = new text(parseFloat(x_init), parseFloat(y_init), parseFloat(z_init), (!font_size_init ? 12 : font_size_init));

				textsAttributes[j] = new textAttributes(
					doc_shapes[j].childNodes[0].nodeValue,
					(!text_anchor_init ? "middle" : text_anchor_init),
					(!fill_init ? "black" : fill_init),
					(!opacity_init ? 1 : opacity_init),
					(!font_family_init ? "Arial" : font_family_init),
					(!font_style_init ? "" : font_style_init),
					(!font_weight_init ? "" : font_weight_init),
					(!letter_spacing_init ? 0 : letter_spacing_init),
					(!writing_mode_init ? "" : writing_mode_init),
					(!glyph_orientation_vertical_init ? "" : glyph_orientation_vertical_init),
					(!z_index_init ? 0 : z_index_init),
					(!attributes_animate ? null : textsAttributesAnimate.length)
				);

				if(attributes_animate){
					textsAttributesAnimate[textsAttributesAnimate.length] = 
						new textAttributesAnimate(j, text_anchor, fill, 
						opacity, font_family, font_style, font_weight, letter_spacing, 
						writing_mode, glyph_orientation_vertical, z_index);
				}
			}

			ZOrders.push(new ZOrder( (!z_index_init ? 0 : z_index_init), j, shape_tags_loc[i] ));

			if(doc_shapes[j].getAttribute("layer") !== null)
				Layers.push(new Layer(doc_shapes[j].getAttribute("layer").split(","), j, shape_tags_loc[i]));
		}
	}

	// SET REFERENCE POINTS
	RefPoints = new Array(0,0,0)
}

function getWindowSizeProjection(z){

	if(z == null) var z = RefPoints[0][2];

	var x_window_shift = getWindowWidth()/2;
	var y_window_shift = getWindowHeight()/2;

	var min_x = -(z - eyez)*(-x_window_shift)/(depth - eyez) - RefPoints[0][0]
	var max_x = -(z - eyez)*(x_window_shift)/(depth - eyez) - RefPoints[0][0]

	var min_y = -(z - eyez)*(-y_window_shift)/(depth - eyez) - RefPoints[0][1]
	var max_y = -(z - eyez)*(y_window_shift)/(depth - eyez) - RefPoints[0][1]

	//alert(min_x + ', ' + max_x + ', ' + min_y + ', ' + max_y);

	return {min_x : min_x, max_x : max_x, min_y : min_y, max_y : max_y, range_x : max_x-min_x, range_y : max_y-min_y};
}

function onLoadFunctions(evt){

	svgns = "http://www.w3.org/2000/svg";
	XLINK = "http://www.w3.org/1999/xlink";

	svgDocument = document.getElementById("world");

	window.onresize = function(event) {
		onWindowResize();
		updateShapes();
	}

	if(BrowserDetect.browser == "Firefox"){
		svgDocument.style.width = getWindowWidth() + "px";
		svgDocument.style.height = getWindowHeight() + "px";
	}

	document.getElementById('keydown').focus();
	document.getElementById('keydown').onclick = setEvents;
	document.getElementById('keydown').onclick();
	document.onkeyup = detectKeyUp;
//	document.onmousemove = getMouseMoveXY;
//	document.onmousedown = mouseDownEvent;
//	document.onmouseup = mouseUpEvent;

	svgDocument.onmousemove = getMouseMoveXY;
	svgDocument.onmousedown = mouseDownEvent;
	svgDocument.onmouseup = mouseUpEvent;

	svgDocument.onkeyup = detectKeyUp;
	svgDocument.onkeydown = detectKeyDown;
	if(window.addEventListener){svgDocument.addEventListener('DOMMouseScroll', scrollEvent, false);}
	svgDocument.onmousewheel = scrollEvent;

	setViewboxProperties();
	getShapes();
	get_transformations();
	setAnimationParameters();

	// Apply default show/hide control panel
	if(show_control_panel){showHideControlPanel("show", false);}else{showHideControlPanel("hide", false);}
	if(start_rotate){toggle_rotate_mode("rotate", false);}else{toggle_rotate_mode("translate", false);}

	// Set background color
	svgDocument.style.backgroundColor = background_color;

	renderShapes();
	fitShapesToWindow();
	updateShapes();
	applyCookies();
	writeControlIcon();

	if(animation_length > 1) startAnimation();

	// Clear all cookies
	//var cookies = listCookies();for (var i = 0; i < cookies.length; i++) deleteCookie(cookies[i].name);
}

function onWindowResize(){

	if(BrowserDetect.browser == "Firefox"){
		svgDocument.style.width = getWindowWidth() + "px";
		svgDocument.style.height = getWindowHeight() + "px";
	}

	setViewboxProperties();
	fitShapesToWindow();
}

function playPauseAnimation(state){

	// If state is undefined, reverse current state
	if(state == undefined){
		if(stop_anim == 1){stop_anim = 0;}else{stop_anim = 1;}
	}else{
		if(state == 'stop'){stop_anim = 1;}else{stop_anim = 0;}
	}

	var control_play = document.getElementById('control_play');
	var control_icon_play = document.getElementById('control_icon_play');

	if(stop_anim == 1){
		// Pause animation
		clearInterval(intervalID);
		
		if(control_play == null) return;

		// Set play/pause icon to play
		control_play.title = 'Click to play animation or press the spacebar';
		control_play.style.padding = '0px 2px 0px 3px';
		control_icon_play.innerHTML = '&#9654;';
		control_icon_play.style.fontSize = '1.2em';
		control_icon_play.style.lineHeight = '23px';
		control_icon_play.style.letterSpacing = '-1px';
	}else{
		// Play animation
		startAnimation();

		if(control_play == null) return;

		// Set play/pause icon to pause
		control_play.title = 'Click to pause animation or press the spacebar';
		control_play.style.padding = '0px 0px 0px 5px';
		control_icon_play.innerHTML = '&#9612; &#9612;';
		control_icon_play.style.fontSize = '0.8em';
		control_icon_play.style.lineHeight = '19px';
		control_icon_play.style.letterSpacing = '-1px';
	}
}

function renderShapes(){ 	 	

	var i;
	var idx;
	var len;
	var shape;
	var svg_shape_type;

	// Sort by Z-Order
	ZOrders.sort(function(a,b){return a.z - b.z})

	// Add shapes to SVG document
	for (i = 0, len = ZOrders.length; i < len; i++) {

		idx = ZOrders[i].i;

		svg_shape_type = ZOrders[i].type;
		if(svg_shape_type == 'point') svg_shape_type = 'circle';
		if(svg_shape_type == 'pathC') svg_shape_type = 'path';

		shape = document.createElementNS(svgns, svg_shape_type);
		shape.setAttribute("id", ZOrders[i].type + idx);

		eval('shape.setAttribute("style", attributesToString(' + ZOrders[i].type + 'sAttributes[' + idx + ']))');

		if(ZOrders[i].type == 'image'){
			shape.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imagesAttributes[idx].src);
			shape.setAttribute("preserveAspectRatio", imagesAttributes[idx].preserveAspectRatio);
		}

		if(ZOrders[i].type == 'text'){
			var textBlock = document.createTextNode(textsAttributes[idx].text);
			shape.appendChild(textBlock);
		}

		if(ZOrders[i].type == 'point') shape.setAttribute("r", pointsAttributes[idx].r);

		svgDocument.appendChild(shape);
	}

	return;
}

function setAnimationParameters(){

	var i, len;
	var property_length;

	for (i = 0, len = shape_tags.length; i < len; i++){

		property_length = 'x';

		if(shape_tags[i] == 'line') property_length = 'x1';

		eval('if(' + shape_tags[i] + 'sAnimate.length){' + shape_tags[i] + 's_animate = true;' + 
			'}else{' + shape_tags[i] + 's_animate = false;}');
	}

	// TEST WHETHER TO ANIMATE SHAPE ATTRIBUTES
	for (i = 0, len = shape_tags.length; i < len; i++){

		eval('if(' + shape_tags[i] + 'sAttributesAnimate.length){' + shape_tags[i] + 's_attributes_animate = true;' + 
			'}else{' + shape_tags[i] + 's_attributes_animate = false;}');
	}

	if(document.getElementById('animation_frame_count_input') == null) return;

	// If there is no animation, hide animation controls
	if(animation_length == 0){
		document.getElementById('control_animation_container').style.display = 'none';
		return;
	}

	// Update animation control max
	document.getElementById('animation_frame_count_input').max = animation_length;

	// Update animation duration
	document.getElementById('animation_duration_input').value = animation_duration;
	
	// Set animation reverse setting
	document.getElementById('animation_reverse_checkbox').checked = animation_reverse;
}

function startAnimation(){
	intervalID = setInterval(animateShapes, Math.round((animation_duration*1000) / animation_length));
}

function svg_path_string_to_array(string){

	var i, j, a;
	var s = "";
	
	// SPLIT PATH BY LETTERS, NUMBERS, SPACES OR COMMAS
	// TO ADD!!: Z AT THE END OF THE PATH
	m_arr = new Array();
	for(i=0;i < string.length;i++){
		a = string.substring(i, i+1);

		if(is_numeric(a) == is_numeric(s)) s += a
		if(a == " " || a == ","){
			m_arr[m_arr.length] = trim(s.toUpperCase());
			s = "";
		}
		if(is_numeric(a) !== is_numeric(s)){
			if(s.length) m_arr[m_arr.length] = trim(s.toUpperCase())
			s = a;
		}
	}
	m_arr[m_arr.length] = trim(s.toUpperCase());

	r_arr = new Array();
	if(is_numeric(m_arr[3])){
		for(j = 0, k = 0;j < m_arr.length;j = j + 4, k++){
			r_arr[k] = new Array();
			r_arr[k][0] = m_arr[j];
			r_arr[k][1] = parseFloat(m_arr[j+1]);
			r_arr[k][2] = parseFloat(m_arr[j+2]);
			r_arr[k][3] = parseFloat(m_arr[j+3]);
		}
	}else{
		if(m_arr[3] == "Q"){

			r_arr[0] = new Array();
			r_arr[0][0] = m_arr[0];
			r_arr[0][1] = parseFloat(m_arr[1]);
			r_arr[0][2] = parseFloat(m_arr[2]);
			for(j = 4, k = 1;j < m_arr.length;j = j + 2, k++){
				r_arr[k] = new Array();
				r_arr[k][0] = "";
				r_arr[k][1] = parseFloat(m_arr[j]);
				r_arr[k][2] = parseFloat(m_arr[j+1]);
			}
			r_arr[1][0] = "Q";
			if(!is_numeric(m_arr[m_arr.length-1])) r_arr[r_arr.length-1][0] = m_arr[m_arr.length-1]			
		}else{
			for(j = 0, k = 0;j < m_arr.length;j = j + 3, k++){
				r_arr[k] = new Array();
				r_arr[k][0] = m_arr[j];
				r_arr[k][1] = parseFloat(m_arr[j+1]);
				r_arr[k][2] = parseFloat(m_arr[j+2]);
			}
		}
	}

	return r_arr;
}

function updateShapes(){

	var i;
	var len;
	var shape;

	var i, j, k, n_i0, n_i1, pathd, u, u1, u2, len;
	var circle, line, n_i, type, visibility, vec;
	var x, y, x1, x2, y1, y2;

	wsize_proj = getWindowSizeProjection();

	// Find perspective projections for shapes
	for (i = 0, len = shape_tags.length; i < len; i++){
		eval('var ' + shape_tags[i] + 's_proj = project(' + shape_tags[i] + 's, depth, eyez, x_window_shift, y_window_shift);');
	}

	for (i = 0, len = circles_proj.length; i < len; i++) {
		var shape = svgDocument.getElementById('circle' + i);
		shape.setAttribute("cx", circles_proj[i].x);
		shape.setAttribute("cy", circles_proj[i].y);
		shape.setAttribute("r", circles_proj[i].r);
	}

	for (i = 0, len = images_proj.length; i < len; i++) {
		var shape = svgDocument.getElementById('image' + i);
		shape.setAttribute("x", images_proj[i].x1);
		shape.setAttribute("y", images_proj[i].y1);
		shape.setAttribute("height", images_proj[i].y2-images_proj[i].y1);
		shape.setAttribute("width", images_proj[i].x2-images_proj[i].x1);
	}

	for (i = 0, len = lines_proj.length; i < len; i++) {
		var shape = svgDocument.getElementById('line' + i);
		shape.setAttribute("x1", lines_proj[i].x1);
		shape.setAttribute("y1", lines_proj[i].y1);
		shape.setAttribute("x2", lines_proj[i].x2);
		shape.setAttribute("y2", lines_proj[i].y2);
	}

	for (i = 0, len = texts_proj.length; i < len; i++) {
		var shape = svgDocument.getElementById('text' + i);
		shape.setAttribute("x", texts_proj[i].x);
		shape.setAttribute("y", texts_proj[i].y);
		shape.setAttribute("font-size", 'font-size:' + texts_proj[i].s + 'px');
		textsAttributes[i].font_size = texts_proj[i].s;
		shape.setAttribute("style", attributesToString(textsAttributes[i]));
	}

	for (i = 0, len = points_proj.length; i < len; i++) {
		var shape = svgDocument.getElementById('point' + i);
		shape.setAttribute("cx", points_proj[i].x);
		shape.setAttribute("cy", points_proj[i].y);
		if(isNaN(points_proj[i].x)){shape.setAttribute("visibility", "hidden");}else{shape.setAttribute("visibility", "");}
	}

	for (i = 0, len = paths_proj.length; i < len; i++) {
		var shape = svgDocument.getElementById('path' + i);
		shape.setAttribute("d", pathToString(paths_proj[i]));
	}

	for (i = 0, len = pathCs.length; i < len; i++) {
		var shape = svgDocument.getElementById('pathC' + i);
		shape.setAttribute("d", pointsToPath(points_proj, pathCs[i]));
	}

	return;
}

function zoom_shape(d, mouseX, mouseY){
	if(d == 0){return;}

	var zoom_speed_n = zoom_speed;
	if(BrowserDetect.browser == "Firefox") var zoom_speed_n = zoom_speed*0.5;

	var d = d/zoom_speed_n;

	// Scale all shapes
	for (i = 0, len = shape_transform.length; i < len; i++) eval('scale(' + shape_transform[i] + ', ' + [1 + d] + ')');

	updateShapes();
}
