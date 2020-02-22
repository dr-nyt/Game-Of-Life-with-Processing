import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class game_of_life extends PApplet {

ArrayList<Box> Boxes;

int boxWidth;
int boxHeight;

int rows;
int columns;

public void setup() {
    

    boxWidth = 50;
    boxHeight = boxWidth;

    rows = PApplet.parseInt(width / boxWidth);
    columns = rows;

    print(rows + "\n");
    print(columns + "\n");

    makeBoxes();
}

public void draw() {
    background(255);

    for(int i = 0; i < Boxes.size(); i++){
        Box aBox = (Box) Boxes.get(i);
        aBox.draw();
    }
}

public void mouseClicked() {
    int x = mouseX;
    int y = mouseY;

    for(int i = 0; i < Boxes.size(); i++){
        Box aBox = (Box) Boxes.get(i);
        aBox.checkClick(x, y);
    }
}

public void makeBoxes() {
    Boxes = new ArrayList<Box>();
    int x = 0;
    int y = 0;
    int idCounter = 0;

    for(int i = 0; i < rows; i++) {
        for(int j = 0; j < columns; j++) {
            Boxes.add(new Box(idCounter, x, y, boxWidth, boxHeight));
            x += 50;
            idCounter += 1;
        }
        y += 50;
        x = 0;
    }
}

class Box {
    public int id;

    public int x;
    public int y;
    public int width;
    public int height;

    public int c;

    int north;
    int west;
    int east;
    int south;

    Box (int id, int x, int y, int width, int height) {
        this.id = id;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.c = color(100, 100, 100);;

        this.north = this.id - rows;
        if(this.north < 0) {
            this.north = -1;
        }
        this.west = this.id - 1;
        if(this.id % rows == 0) {
            this.west = -1;
        }
        this.east = this.id + 1;
        if(this.id % rows == rows - 1) {
            this.east = -1;
        }
        this.south = this.id + rows;
        if(this.south >= rows * columns) {
            this.south = -1;
        }
    }

    public void draw() {
        fill(this.c);
        rect(this.x, this.y, this.width, this.height);
    }

    public void checkClick(int x, int y) {
        if(this.x < x && this.y < y && this.x + this.width > x && this.y + this.height > y) {
            c = color(255, 255, 0);

            print(this.id + "\n");
            
            if(this.north != -1) {
                Box aBox = (Box) Boxes.get(this.north);
                aBox.c = color(255, 0, 0);
            }
            if(this.west != -1) {
                Box aBox = (Box) Boxes.get(this.west);
                aBox.c = color(0, 255, 0);
            }
            if(this.east != -1) {
                Box aBox = (Box) Boxes.get(this.east);
                aBox.c = color(0, 0, 0);
            }
            if(this.south != -1) {
                Box aBox = (Box) Boxes.get(this.south);
                aBox.c = color(0, 255, 255);
            }

        }
    }

}

  public void settings() {  size(900, 900); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "game_of_life" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
