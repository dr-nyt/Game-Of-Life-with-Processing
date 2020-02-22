size(640, 360);

// Line 1
float line1_x1 = 50;
float line1_y1 = 100;
float line1_x2 = 400;
float line1_y2 = 200;

float line1_m = (line1_y1 - line1_y2) / (line1_x1 - line1_x2);
float line1_c = (line1_m * (-line1_x1)) + line1_y1;

// Line 2
float line2_x1 = 400;
float line2_y1 = 20;
float line2_x2 = 50;
float line2_y2 = 200;

float line2_m = (line2_y1 - line2_y2) / (line2_x1 - line2_x2);
float line2_c = (line2_m * (-line2_x1)) + line2_y1;

// Center Point
float point_m = line1_m - line2_m;
float point_c = line2_c + line1_c;

float point_x = round(point_c / point_m);
float point_y = round((line1_m * point_x) + line1_c);

// Log & Render
print(point_x);
print("\n");
print(point_y);
print("\n");

line(line1_x1, line1_y1, line1_x2, line1_y2);  // Render Line 1
line(line2_x1, line2_y1, line2_x2, line2_y2);  // Render Line 2

boolean intersect = false;

strokeWeight(10);
stroke(0, 0, 255);
point(point_x, point_y);                       // Render Center Point   
intersect = true;

if(intersect) {
  if(line1_y1 < point_y) {
      line1_x2 = point_x;
      line1_y2 = point_y;
      
      strokeWeight(5);
      stroke(255, 0, 0);
      line(line1_x1, line1_y1, line1_x2, line1_y2);
  } else {
      line1_x1 = point_x;
      line1_y1 = point_y;
      
      strokeWeight(5);
      stroke(255, 0, 0);
      line(line1_x1, line1_y1, line1_x2, line1_y2);
  }
  
  if(line2_y1 < point_y) {
      line2_x2 = point_x;
      line2_y2 = point_y;
      
      strokeWeight(5);
      stroke(0, 255, 0);
      line(line2_x1, line2_y1, line2_x2, line2_y2);
  } else {
      line2_x1 = point_x;
      line2_y1 = point_y;
      
      strokeWeight(5);
      stroke(0, 255, 0);
      line(line2_x1, line2_y1, line2_x2, line2_y2);
  }
}
