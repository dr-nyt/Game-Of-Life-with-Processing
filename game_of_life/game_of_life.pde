ArrayList<Box> Boxes;
color boxColorAlive = color(255, 255, 255);
color boxColorDead = color(0, 0, 0);

int boxWidth;
int boxHeight;

int trueWidth = 1000;
int trueHeight = 1000;

int rows;
int columns;

boolean start = false;
boolean debug = false;
color debugColor = color(10, 100, 255);
boolean addBlock = false;
int frameCounter = 0;

PImage screenShot;

boolean star = false;
boolean glider = false;
boolean block = false;

ScrollRect scrollRect;        // the vertical scroll bar
float heightOfCanvas = trueHeight;  // realHeight of the entire scene  

void setup() {
    size(1000, 1000);

    boxWidth = 2;
    boxHeight = boxWidth;

    rows = int(width / boxWidth);
    columns = rows;

    scrollRect = new ScrollRect();

    makeBoxes();
}

void update() {
    if(start) {
        for(int i = 0; i < Boxes.size(); i++){
            Box aBox = (Box) Boxes.get(i);
            if(aBox.isAlive || aBox.isInterest) {
                aBox.game();
            }
        }
    }
}

void draw() {
    background(255);
    scene();
    scrollRect.display();
    scrollRect.update();
}

void scene() {
  pushMatrix();
 
  // reading scroll bar 
  float newYValue = scrollRect.scrollValue();  
  translate (0, newYValue);
 
  // The scene :
  if(debug) {
        if(frameCounter < 6) {
            update();
            frameCounter += 1;
        }
    } else {
            update(); 
    }

    for(int i = 0; i < Boxes.size(); i++){
            Box aBox = (Box) Boxes.get(i);
            aBox.run();
    }
    
    //for(int i = 0; i < Boxes.size(); i++){
    //        Box aBox = (Box) Boxes.get(i);
    //        try {
    //            aBox.join();
    //        } catch(Exception e) {
    //            print(e);
    //        }
    //}
    
    println(frameRate);
 
  popMatrix();
}

void mousePressed() {
  scrollRect.mousePressedRect();
}
 
void mouseReleased() {
  scrollRect.mouseReleasedRect();
}

void keyPressed() {
    if(key == ENTER) {
        if(start) {
            start = false;
            print("Stopped\n");
        } else {
            start = true;
            print("Started\n");
        }
    } else if (key == ' ') {
        frameCounter = 0;
        print("Reset frame counter\n");
    } else if (key == 'x') {
        start = false;
        star = false;
        glider = false;
        block = false;
        wipe();
        print("Wiped\n");
    } else if (key == 's') {
        if(star) {
            star = false;
            print("Removed Pattern\n");
        } else {
            star = true;
            glider = false;
            block = false;
            print("Star Pattern\n");
        }
    } else if (key == 'g') {
        if(glider) {
            glider = false;
            print("Removed Pattern\n");
        } else {
            glider = true;
            star = false;
            block = false;
            print("Glider Pattern\n");
        }
    } else if (key == 'b') {
         if(block) {
             block = false;
             print("Removed Pattern\n");
         } else {
             block = true;
             star = false;
             glider = false;
             print("Block Pattern\n");
         }
    } else if(key == 'd') {
         if(debug) {
              debug = false;
              print("Debug Off\n");
         } else {
              debug = true; 
              print("Debug On\n");
         }
    } else if (key == 't') {
        addBlock = true;
        print("Block added\n");
    } else if (key == 'p') {
         screenShot = get(0, 0, trueWidth, trueHeight);
         screenShot.save("output.png");
         print("Screenshot saved!");
    }
}

void mouseClicked() {
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

void makeBoxes() {
    Boxes = new ArrayList<Box>();
    int x = 0;
    int y = 0;
    int idCounter = 0;
    color rand = color(0,0,0);

    for(int i = 0; i < rows; i++) {
        for(int j = 0; j < columns; j++) {
          rand = color(random(255), random(255), random(255));
          if(rand == color(0, 0, 0)) {rand = color(255, 255, 0);}
            Boxes.add(new Box(idCounter, x, y, boxWidth, boxHeight, color(random(255), random(255), random(255)), boxColorDead));
            x += boxWidth;
            idCounter += 1;
        }
        y += boxHeight;
        x = 0;
    }
}

void wipe() {
    for(int i = 0; i < Boxes.size(); i++){
        Box aBox = (Box) Boxes.get(i);
        aBox.score = 0;
    }
}

class Box extends Thread {
    public int id;
    public boolean isAlive = false;
    public int score = 0;
    public boolean isInterest = false;

    public int x;
    public int y;
    public int width;
    public int height;
    public color boxColorAlive;
    public color boxColorDead;
    
    public color c;

    int north;
    int northWest;
    int northEast;
    int west;
    int east;
    int south;
    int southWest;
    int southEast;

    Box (int id, int x, int y, int width, int height, color boxColorAlive, color boxColorDead) {
        this.id = id;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.boxColorAlive = boxColorAlive;
        this.boxColorDead = boxColorDead;
        
        this.c = this.boxColorDead;

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
    
    public void run() {
        draw(); 
    }

    void draw() {
        if(this.score == 1) {
            this.isAlive = true;
            fill(this.boxColorAlive);
        } else {
            this.isAlive = false;
            fill(this.boxColorDead);
        }

        
        if(this.id == ((rows * columns) / 2) + (columns / 2)) {
            if(debug) {
                fill(debugColor);
            }
            if(addBlock) {
                block = true;
                checkClick();
                addBlock = false;
            }
        }

        rect(this.x, this.y, this.width, this.height);
    }

    void game() {
        int neighbours = 0;

        if(this.north != -1) {
            Box aBox = (Box) Boxes.get(this.north);
            if(aBox.isAlive) {
                neighbours += 1;
                this.boxColorAlive = aBox.boxColorAlive;
            }
            else {aBox.isInterest = true;}
        }
        if(this.northWest != -1) {
            Box aBox = (Box) Boxes.get(this.northWest);
            if(aBox.isAlive) {
                neighbours += 1;
                this.boxColorAlive = aBox.boxColorAlive;
            }
            else {aBox.isInterest = true;}
        }
        if(this.northEast != -1) {
            Box aBox = (Box) Boxes.get(this.northEast);
            if(aBox.isAlive) {
                neighbours += 1;
                this.boxColorAlive = aBox.boxColorAlive;
            }
            else {aBox.isInterest = true;}
        }
        if(this.west != -1) {
            Box aBox = (Box) Boxes.get(this.west);
            if(aBox.isAlive) {
                neighbours += 1;
                this.boxColorAlive = aBox.boxColorAlive;
            }
            else {aBox.isInterest = true;}
        }
        if(this.east != -1) {
            Box aBox = (Box) Boxes.get(this.east);
            if(aBox.isAlive) {
                neighbours += 1;
                this.boxColorAlive = aBox.boxColorAlive;
            }
            else {aBox.isInterest = true;}
        }
        if(this.south != -1) {
            Box aBox = (Box) Boxes.get(this.south);
            if(aBox.isAlive) {neighbours += 1;}
            else {aBox.isInterest = true;}
        }
        if(this.southWest != -1) {
            Box aBox = (Box) Boxes.get(this.southWest);
            if(aBox.isAlive) {
                neighbours += 1;
                this.boxColorAlive = aBox.boxColorAlive;
            }
            else {aBox.isInterest = true;}
        }
        if(this.southEast != -1) {
            Box aBox = (Box) Boxes.get(this.southEast);
            if(aBox.isAlive) {
                neighbours += 1;
                this.boxColorAlive = aBox.boxColorAlive;
            }
            else {aBox.isInterest = true;}
        }

        if(neighbours < 2) {
            this.score = 0;
            this.isInterest = false;
        } else if (neighbours == 3) {
            this.score = 1;
        } else if (neighbours > 3) {
            this.score = 0;
            this.isInterest = false;
        }
    }

    void checkClick() {
        if(this.isAlive) {
            this.isAlive = false;
            this.score = 0;
            this.c = this.boxColorDead;
        } else {
            this.isAlive = true;
            this.score = 1;
            this.c = this.boxColorAlive;
        }

        if(star) {
            if(this.north != -1) {
                this.isAlive = true;
                this.score = 1;
                this.c = this.boxColorAlive;
            
                Box aBox = (Box) Boxes.get(this.north);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = this.boxColorAlive;
            }
            if(this.west != -1) {
                Box aBox = (Box) Boxes.get(this.west);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = this.boxColorAlive;
            }
            if(this.east != -1) {
                Box aBox = (Box) Boxes.get(this.east);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = this.boxColorAlive;
            }
            if(this.south != -1) {
                Box aBox = (Box) Boxes.get(this.south);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = this.boxColorAlive;
            }
        } else if (glider) {
            this.isAlive = false;
            this.score = 0;
            this.c = this.boxColorDead;

            if(this.north != -1) {
                Box aBox = (Box) Boxes.get(this.north);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = this.boxColorAlive;
            }
            if(this.east != -1) {
                Box aBox = (Box) Boxes.get(this.east);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = this.boxColorAlive;
            }
            if(this.south != -1) {
                Box aBox = (Box) Boxes.get(this.south);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = this.boxColorAlive;
            }
            if(this.southWest != -1) {
                Box aBox = (Box) Boxes.get(this.southWest);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = this.boxColorAlive;
            }
            if(this.southEast != -1) {
                Box aBox = (Box) Boxes.get(this.southEast);
                aBox.isAlive = true;
                aBox.score = 1;
                aBox.c = this.boxColorAlive;
            }
        } else if (block) {
            this.isAlive = true;
            this.score = 1;
            this.c = this.boxColorAlive;
          
             if(this.north != -1) {
                  Box aBox = (Box) Boxes.get(this.north);
                  aBox.isAlive = true;
                  aBox.score = 1;
                  aBox.c = this.boxColorAlive;
              }
              if(this.northWest != -1) {
                  Box aBox = (Box) Boxes.get(this.northWest);
                  aBox.isAlive = true;
                  aBox.score = 1;
                  aBox.c = this.boxColorAlive;
                  
                  int northWest = (this.northWest - rows) - 1;
                  while(northWest >= 0 && northWest % rows != 0) {
                      aBox = (Box) Boxes.get(northWest);
                      aBox.isAlive = true;
                      aBox.score = 1;
                      aBox.c = this.boxColorAlive;
                      
                      northWest = (northWest - rows) - 1;
                  }
              }
              if(this.northEast != -1) {
                  Box aBox = (Box) Boxes.get(this.northEast);
                  aBox.isAlive = true;
                  aBox.score = 1;
                  aBox.c = this.boxColorAlive;
                  
                  int northEast = (this.northEast - rows) + 1;
                  while(northEast >= 0 && northEast % rows != rows - 1) {
                      aBox = (Box) Boxes.get(northEast);
                      aBox.isAlive = true;
                      aBox.score = 1;
                      aBox.c = this.boxColorAlive;
                      
                      northEast = (northEast - rows) + 1;
                  }
              }
              if(this.west != -1) {
                  Box aBox = (Box) Boxes.get(this.west);
                  aBox.isAlive = true;
                  aBox.score = 1;
                  aBox.c = this.boxColorAlive;
              }
              if(this.east != -1) {
                  Box aBox = (Box) Boxes.get(this.east);
                  aBox.isAlive = true;
                  aBox.score = 1;
                  aBox.c = this.boxColorAlive;
              }
              if(this.south != -1) {
                  Box aBox = (Box) Boxes.get(this.south);
                  aBox.isAlive = true;
                  aBox.score = 1;
                  aBox.c = this.boxColorAlive;
              }
              if(this.southWest != -1) {
                  Box aBox = (Box) Boxes.get(this.southWest);
                  aBox.isAlive = true;
                  aBox.score = 1;
                  aBox.c = this.boxColorAlive;
                  
                  int southWest = (this.southWest + rows) - 1;
                  while(southWest < rows * columns && southWest % rows != 0) {
                      aBox = (Box) Boxes.get(southWest);
                      aBox.isAlive = true;
                      aBox.score = 1;
                      aBox.c = this.boxColorAlive;
                      
                      southWest = (southWest + rows) - 1;
                  }
              }
              if(this.southEast != -1) {
                  Box aBox = (Box) Boxes.get(this.southEast);
                  aBox.isAlive = true;
                  aBox.score = 1;
                  aBox.c = this.boxColorAlive;
                  
                  int southEast = (this.southEast + rows) + 1;
                  while(southEast < rows * columns && southEast % rows != rows - 1) {
                      aBox = (Box) Boxes.get(southEast);
                      aBox.isAlive = true;
                      aBox.score = 1;
                      aBox.c = this.boxColorAlive;
                      
                      southEast = (southEast + rows) + 1;
                  }
              }
        }
    }

}

class ScrollRect {
 
  float rectPosX=0;
  float rectPosY=0;
  float rectWidth=14; 
  float rectHeight=30;
 
  boolean holdScrollRect=false; 
 
  float offsetMouseY; 
 
  //constr
  ScrollRect() {
    // you have to make a scrollRect in setup after size()
    rectPosX=width-rectWidth-1;
  }//constr
 
  void display() {
    fill(122);
    stroke(0);
    line (rectPosX-1, 0, 
      rectPosX-1, height);
    rect(rectPosX, rectPosY, 
      rectWidth, rectHeight);
 
    // Three small lines in the center   
    centerLine(-3); 
    centerLine(0);
    centerLine(3);
  }
 
  void centerLine(float offset) {
    line(rectPosX+3, rectPosY+rectHeight/2+offset, 
      rectPosX+rectWidth-3, rectPosY+rectHeight/2+offset);
  }
 
  void mousePressedRect() {
    if (mouseOver()) {
      holdScrollRect=true;
      offsetMouseY=mouseY-rectPosY;
    }
  }
 
  void mouseReleasedRect() {
    scrollRect.holdScrollRect=false;
  }
 
  void update() {
    // dragging of the mouse 
    if (holdScrollRect) {
      rectPosY=mouseY-offsetMouseY;
      if (rectPosY<0)
        rectPosY=0;
      if (rectPosY+rectHeight>height-1)
        rectPosY=height-rectHeight-1;
    }
  }
 
  float scrollValue() {
    return
      map(rectPosY, 
      0, height-rectHeight, 
      0, - (heightOfCanvas - height));
  }
 
  boolean mouseOver() {
    return mouseX>rectPosX&&
      mouseX<rectPosX+rectWidth&&
      mouseY>rectPosY&&
      mouseY<rectPosY+rectHeight;
  }//function 
  //
}//class
