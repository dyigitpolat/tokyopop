WIDTH = 600
CX = WIDTH / 2
CY = WIDTH / 2

stroke_width = 1.5

let svg = document.getElementById("bowie");
svg.setAttribute("width", WIDTH);
svg.setAttribute("height", WIDTH);

function drawFilledRectangle(x, y, w, h, color)
{
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.setAttribute("fill", color);
    svg.appendChild(rect);
}

function drawFilledCircle(cx, cy, r, color)
{
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", color);
    svg.appendChild(circle);
}

function drawCircularArc(cx, cy, r, startAngle, endAngle, color)
{
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let d = "M " + (cx + r * Math.cos(startAngle)) + " " + (cy + r * Math.sin(startAngle)) +
            " A " + r + " " + r + " 0 0 1 " + (cx + r * Math.cos(endAngle)) + " " + (cy + r * Math.sin(endAngle));
    path.setAttribute("d", d);
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", stroke_width);
    path.setAttribute("fill", "none");
    svg.appendChild(path);
}

function drawLine(x1, y1, x2, y2, color)
{
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", stroke_width);
    svg.appendChild(line);
}

function drawPoint(x, y, color)
{
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 2);
    circle.setAttribute("fill", color);
    svg.appendChild(circle);
}

function rad(degrees) 
{
    return degrees * Math.PI / 180;
}

function sqrt(x)
{
    return Math.sqrt(x)
}

function drawSmoothTriangle(t, a, color)
{
    r = (a - t*a)*sqrt(3)/6

    x1 = CX - (t*a*0.5)
    y1 = CY + (a * sqrt(3) / 6)
    x2 = CX + (t*a*0.5)
    y2 = y1
    cx_arc = CX + (t*a*0.5)
    cy_arc = CY + (t*a*sqrt(3)/6)
    drawLine(x1, y1, x2, y2, color)
    drawCircularArc(
        cx_arc, cy_arc, r, rad(-30), rad(90), color)

    x1 = CX + r * Math.cos(rad(-30))
    y1 = CY - (t * a * sqrt(3) / 3) + r * Math.sin(rad(-30))
    x2 = CX + (t * a * 0.5) + r * Math.cos(rad(-30))
    y2 = CY + (t * a * sqrt(3) / 6) + r * Math.sin(rad(-30))
    cx_arc = CX
    cy_arc = CY - (t*a*sqrt(3)/3)
    drawLine(x1, y1, x2, y2, color)
    drawCircularArc(
        cx_arc, cy_arc, r, rad(-150), rad(-30), color)

    x1 = CX + r * Math.cos(rad(-150))
    y1 = CY - (t * a * sqrt(3) / 3) + r * Math.sin(rad(-150))
    x2 = CX - (t * a * 0.5) + r * Math.cos(rad(-150))
    y2 = CY + (t * a * sqrt(3) / 6) + r * Math.sin(rad(-150))
    cx_arc = CX - (t*a*0.5)
    cy_arc = CY + (t*a*sqrt(3)/6)
    drawLine(x1, y1, x2, y2, color)
    drawCircularArc(
        cx_arc, cy_arc, r, rad(90), rad(-150), color)
}

function render(beta, gamma, p, q)
{
    if(p - q > 2) p = q - 2;

    svg.innerHTML = ""
    scale = 850.0
    
    drawFilledRectangle(0, 0, WIDTH, WIDTH, "darkred")
    drawFilledCircle(CX, CY, 0.3 * scale , "black")
    
    for(let i = p; i <= q; i++)
    {
        t = 1.0 - (Math.pow(i, beta) / Math.pow(q, beta))
        a = scale * Math.pow(i, gamma) / Math.pow(q, gamma)
        drawSmoothTriangle(t, a, "lightgrey")
    }
}

function update()
{

    beta = parseFloat(document.getElementById("beta_slider").value)
    gamma = parseFloat(document.getElementById("gamma_slider").value)
    p = parseInt(document.getElementById("p_slider").value)
    q = parseInt(document.getElementById("q_slider").value)


    document.getElementById("beta_out").innerHTML = beta
    document.getElementById("gamma_out").innerHTML = gamma
    document.getElementById("p_out").innerHTML = p
    document.getElementById("q_out").innerHTML = q

    render(beta, gamma, p, q)
    document.getElementById("svg_code").innerHTML = svg.outerHTML
}

update()



