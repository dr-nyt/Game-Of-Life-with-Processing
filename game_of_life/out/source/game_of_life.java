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

boolean start = false;
boolean debug = false;
boolean star = false;
boolean glider = false;

public void setup() {
    

    boxWidth = 10;
    boxHeight = boxWidth;

    rows = PApplet.parseInt(width / boxWidth);
    columns = rows;

    print(rows + "\n");
    print(columns + "\n");

    makeBoxes();
}

public void update() {
    if(start) {
        for(int i = 0; i < Boxes.size(); i++){
            Box aBox = (Box) Boxes.get(i);
            if(aBox.isAlive || aBox.isInterest) {
                aBox.game();
            }
        }
    }
}

public void draw() {
    update();
    background(255);

    for(int i = 0; i < Boxes.size(); i++){
        Box aBox = (Box) Boxes.get(i);
        aBox.draw();
    }
}

public void keyPressed() {
    if(key == ENTER) {
        if(start) {
            start = false;
        } else {
            start = true;
        }
    } else if (key == 'x') {
        start = false;
        star = false;
        glider = false;
        wipe();
    } else if (key == 's') {
        if(star) {
            star = false;
        } else {
            star = true;
            glider = false;
        }
    } else if (key == 'g') {
        if(glider) {
            glider = false;
        } else {
            glider = true;
            star = false;
        }
    }
}

public void mouseClicked() {
    int x = mouseX;
    int y = mouseY;

    for(int i = 0; i < Boxes.size(); i++){
        Box aBox = (Box) Boxes.get(i);
        if(aBox.x < x && aBox.y < y && aBox.x + aBox.width > x && aBox.y + aBox.height > y) {
            aBox.checkClick();
            break;
        }
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
            x += boxWidth;
            idCounter += 1;
        }
        y += boxHeight;
        x = 0;
    }
}

public void wipe() {
    for(int i = 0; i < Boxes.size(); i++){
        Box aBox = (Box) Boxes.get(i);
        aBox.score = 0;
    }
}

class Box {
    public int id;
    public boolean isAlive = false;
    public int score = 0;
    public boolean isInterest = false;

    public int x;
    public int y;
    public int width;
    public int height;

    public int c;

    int north;
    int northWest;
    int northEast;
    int west;
    int east;
    int south;
    int southWest;
    int southEast;

    Box (int id, int x, int y, int width, int height) {
        this.id = id;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.c = color(100, 100, 100);;

        this.north = this.id - rows;
        this.northWest = this.north - 1;
        this.northEast = this.north + 1;
        if(this.north < 0) {
            this.north = -1;
            this.northWest = -1;
            this.northEast = -1;
        }

        this.south = this.id + rows;
        this.southWest = this.south - 1;
        this.southEast = this.south + 1;
        if(this.south >= rows * columns) {
            this.south = -1;
            this.southWest = -1;
            this.southEast = -1;
        }

        this.west = this.id - 1;
        if(this.id % rows == 0) {
            this.west = -1;
            this.northWest = -1;
            this.southWest = -1;
        }

        this.east = this.id + 1;
        if(this.id % rows == rows - 1) {
            this.east = -1;
            this.northEast = -1;
            this.southEast = -1;
        }


    }

    public void draw() {
        if(this.score == 1) {
            this.isAlive = true;
            fill(color(255, 255, 0));
        } else {
            this.isAlive = false;
            fill(color(100, 100, 100));
        }
        rect(this.x, this.y, this.width, this.height);
    }

    public void game() {
        int neighbours = 0;

        if(this.north != -1) {
            Box aBox = (Box) Boxes.get(this.north);
            if(aBox.isAlive) {neighbours += 1;}
            else {aBox.isInterest = true;}
        }
        if(this.northWest != -1) {
            Box aBox = (Box) Boxes.get(this.northWest);
            if(aBox.isAlive) {neighbours += 1;}
            else {aBox.isInterest = true;}
        }
        if(this.northEast != -1) {
            Box aBox = (Box) Boxes.get(this.northEast);
            if(aBox.isAlive) {neighbours += 1;}
            else {aBox.isInterest = true;}
        }
        if(this.west != -1) {
            Box aBox = (Box) Boxes.get(this.west);
            if(aBox.isAlive) {neighbours += 1;}
            else {aBox.isInterest = true;}
        }
        if(this.east != -1) {
            Box aBox = (Box) Boxes.get(this.east);
            if(aBox.isAlive) {neighbours += 1;}
            else {aBox.isInterest = true;}
        }
        if(this.south != -1) {
            Box aBox = (Box) Boxes.get(this.south);
            if(aBox.isAlive) {neighbours += 1;}
            else {aBox.isInterest = true;}
        }
        if(this.southWest != -1) {
            Box aBox = (Box) Boxes.get(this.southWest);
            if(aBox.isAlive) {neighbours += 1;}
            else {aBox.isInterest = true;}
        }
        if(this.southEast != -1) {
            Box aBox = (Box) Boxes.get(this.southEast);
            if(aBox.isAlive) {neighbours += 1;}
            else {aBox.isInterest = true;}
        }

        if(neighbours < 2) {
            this.score = 0;
        } else if (neighbours == 3) {
            this.score = 1;
        } else if (neighbours > 3) {
            this.score = 0;  
        }
    }

    public void checkClick() {
        if(this.isAlive) {
            this.isAlive = false;
            this.score = 0;
            this.c = color(100, 100, 100);
        } else {
            this.isAlive = true;
            this.score = 1;
            this.c = color(255, 255, 0);
        }

        if(star) {
            if(this.north != -1) {
                Box aBox = (Box) Boxes.get(this.north);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = color(255, 255, 0);
            }
            if(this.west != -1) {
                Box aBox = (Box) Boxes.get(this.west);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = color(255, 255, 0);
            }
            if(this.east != -1) {
                Box aBox = (Box) Boxes.get(this.east);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = color(255, 255, 0);
            }
            if(this.south != -1) {
                Box aBox = (Box) Boxes.get(this.south);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = color(255, 255, 0);
            }
        } else if (glider) {
            this.isAlive = false;
            this.score = 0;
            this.c = color(100, 100, 100);

            if(this.north != -1) {
                Box aBox = (Box) Boxes.get(this.north);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = color(255, 255, 0);
            }
            if(this.east != -1) {
                Box aBox = (Box) Boxes.get(this.east);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = color(255, 255, 0);
            }
            if(this.south != -1) {
                Box aBox = (Box) Boxes.get(this.south);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = color(255, 255, 0);
            }
            if(this.southWest != -1) {
                Box aBox = (Box) Boxes.get(this.southWest);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = color(255, 255, 0);
            }
            if(this.southEast != -1) {
                Box aBox = (Box) Boxes.get(this.southEast);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = color(255, 255, 0);
            }
        }
    }

}

  public void settings() {  size(2000, 2000); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "game_of_life" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
