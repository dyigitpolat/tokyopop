let svg = document.getElementById("bowie");
let stroke_width = 1.5;

function updateWidth() {
    WIDTH = document.getElementById("controls").offsetWidth;
    CX = WIDTH / 2;
    CY = WIDTH / 2;

    svg.setAttribute("width", WIDTH);
    svg.setAttribute("height", WIDTH);
    update();
}
window.onresize = updateWidth;
updateWidth();


function drawFilledRectangle(x, y, w, h, color) {
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.setAttribute("fill", color);
    svg.appendChild(rect);
}

function drawFilledCircle(cx, cy, r, color) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", color);
    svg.appendChild(circle);
}

function drawCircularArc(cx, cy, r, startAngle, endAngle, color) {
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let d =
        "M " +
        (cx + r * Math.cos(startAngle)) +
        " " +
        (cy + r * Math.sin(startAngle)) +
        " A " +
        r +
        " " +
        r +
        " 0 0 1 " +
        (cx + r * Math.cos(endAngle)) +
        " " +
        (cy + r * Math.sin(endAngle));
    path.setAttribute("d", d);
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", stroke_width);
    path.setAttribute("fill", "none");
    svg.appendChild(path);
}

function drawLine(x1, y1, x2, y2, color) {
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", stroke_width);
    svg.appendChild(line);
}

function rad(degrees) {
    return (degrees * Math.PI) / 180;
}

function sqrt(x) {
    return Math.sqrt(x);
}

function drawSmoothTriangle(t, a, color) {
    r = ((a - t * a) * sqrt(3)) / 6;

    x1 = CX - t * a * 0.5;
    y1 = CY + (a * sqrt(3)) / 6;
    x2 = CX + t * a * 0.5;
    y2 = y1;
    cx_arc = CX + t * a * 0.5;
    cy_arc = CY + (t * a * sqrt(3)) / 6;
    drawLine(x1, y1, x2, y2, color);
    drawCircularArc(cx_arc, cy_arc, r, rad(-30), rad(90), color);

    x1 = CX + r * Math.cos(rad(-30));
    y1 = CY - (t * a * sqrt(3)) / 3 + r * Math.sin(rad(-30));
    x2 = CX + t * a * 0.5 + r * Math.cos(rad(-30));
    y2 = CY + (t * a * sqrt(3)) / 6 + r * Math.sin(rad(-30));
    cx_arc = CX;
    cy_arc = CY - (t * a * sqrt(3)) / 3;
    drawLine(x1, y1, x2, y2, color);
    drawCircularArc(cx_arc, cy_arc, r, rad(-150), rad(-30), color);

    x1 = CX + r * Math.cos(rad(-150));
    y1 = CY - (t * a * sqrt(3)) / 3 + r * Math.sin(rad(-150));
    x2 = CX - t * a * 0.5 + r * Math.cos(rad(-150));
    y2 = CY + (t * a * sqrt(3)) / 6 + r * Math.sin(rad(-150));
    cx_arc = CX - t * a * 0.5;
    cy_arc = CY + (t * a * sqrt(3)) / 6;
    drawLine(x1, y1, x2, y2, color);
    drawCircularArc(cx_arc, cy_arc, r, rad(90), rad(-150), color);
}

function cos_interpolate(x) {
    return 0.5 * (1 - Math.cos(x * Math.PI));
}

function render(beta, gamma, alpha, sigma, p, q) {
    if (q - p < 2) p = q - 2;

    svg.innerHTML = "";
    scale = WIDTH * sqrt(3) * 0.9;

    drawFilledRectangle(0, 0, WIDTH, WIDTH, "darkred");
    drawFilledCircle(CX, CY, (1.03 * scale) / (2 * sqrt(3)), "black");

    for (let i = p; i <= q; i++) {
        step = (1.0 * i) / q;
        t =
            1.0 -
            (sigma * Math.pow(cos_interpolate(Math.pow(step, alpha)), beta) +
                (1 - sigma) * step);
        a = Math.pow(step, gamma) * scale;
        drawSmoothTriangle(t, a, "lightgrey");
    }
}

function h(a, t) {
    return (a * (t + 1) * sqrt(3)) / 6;
}

function side_of_sharp_triangle(h) {
    // h = a * 2 * sqrt(3) / 3
    // a = 3 * h / (2 * sqrt(3))
    return (6 * h) / (2 * sqrt(3));
}

function render_optimal(p, q) {
    if (q - p < 2) p = q - 2;
    svg.innerHTML = "";
    scale = WIDTH * sqrt(3) * 0.9;

    drawFilledRectangle(0, 0, WIDTH, WIDTH, "darkred");
    drawFilledCircle(CX, CY, (1.03 * scale) / (2 * sqrt(3)), "black");

    max_h = 1.0 / (2 * sqrt(3));

    for (let i = p; i <= q; i++) {
        step = (1.0 * i) / q;
        h_ = step * max_h;

        a = step;
        t = 1 - step;
        delta = 0.0001;

        while (Math.abs(h(a, t) - h_) > 0.001) {
            dir0 = Math.abs(h(a - delta, t) - h_);
            dir1 = Math.abs(h(a + delta, t) - h_);
            dir2 = Math.abs(h(a, t - delta) - h_);
            dir3 = Math.abs(h(a, t + delta) - h_);

            if (dir2 < dir0 && dir2 < dir1 && dir2 < dir3) {
                t -= delta;
            }

            if (dir1 < dir0 && dir1 < dir2 && dir1 < dir3) {
                a += delta;
            }

            if (dir3 < dir0 && dir3 < dir1 && dir3 < dir2) {
                t += delta;
            }

            if (dir0 < dir1 && dir0 < dir2 && dir0 < dir3) {
                a -= delta;
            }
        }

        if (i == p)
            drawSmoothTriangle(1.0, side_of_sharp_triangle(h_) * scale, "lightgrey");
        else drawSmoothTriangle(t, a * scale, "lightgrey");
    }
}

function update() {
    beta = parseFloat(document.getElementById("beta_slider").value);
    gamma = parseFloat(document.getElementById("gamma_slider").value);
    alpha = parseFloat(document.getElementById("alpha_slider").value);
    sigma = parseFloat(document.getElementById("sigma_slider").value);
    p = parseInt(document.getElementById("p_slider").value);
    q = parseInt(document.getElementById("q_slider").value);

    document.getElementById("beta_out").innerHTML = beta;
    document.getElementById("gamma_out").innerHTML = gamma;
    document.getElementById("alpha_out").innerHTML = alpha;
    document.getElementById("sigma_out").innerHTML = sigma;
    document.getElementById("p_out").innerHTML = p;
    document.getElementById("q_out").innerHTML = q;

    if (document.getElementById("optimal").checked) {
        document.getElementById("beta_slider").disabled = true;
        document.getElementById("gamma_slider").disabled = true;
        document.getElementById("alpha_slider").disabled = true;
        document.getElementById("sigma_slider").disabled = true;
        render_optimal(p, q);
    } else {
        document.getElementById("beta_slider").disabled = false;
        document.getElementById("gamma_slider").disabled = false;
        document.getElementById("alpha_slider").disabled = false;
        document.getElementById("sigma_slider").disabled = false;
        render(beta, gamma, alpha, sigma, p, q);
    }
}

update();

function copyToClipboard() {
    navigator.clipboard.writeText(svg.outerHTML);
    alert("Copied!");
}
