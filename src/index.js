import React from 'react'; 
import ReactDOM from 'react-dom';
import './index.css';
//BOOTSTRAP
import { ButtonToolbar } from 'react-bootstrap';


//GAME RULES
class Rules extends React.Component {
    render(){
        return(
            <div class="rules">
            <hr></hr>
            <h5>
                <p><b>The Rules</b></p>
                <p>Any alive cell that is touching less than two alive neighbours dies.</p>
                <p>Any alive cell touching four or more alive neighbours dies.</p>
                <p>Any alive cell touching two or three alive neighbours does nothing.</p>
                <p>Any dead cell touching exactly three alive neighbours becomes alive.</p></h5>
                <br></br><h4>Have fun!</h4></div>
        );
    }
}

//BOX
class Box extends React.Component {
    selectBox = () => {
        this.props.selectBox(this.props.row, this.props.col);
    }

    render() {
        return(
            <div
            className={this.props.boxClass}
            id={this.props.id}
            onClick={this.selectBox}
            />
        );
    }
}


//GRID
class Grid extends React.Component {
    //COLOUR FUNCTION
     newColour = () => {
        this.newColour = this.props.update.bind(this, this.props.index);
     }

    render() {
        const width = this.props.cols * 14;
        var rowsArr = [];
        let style = {
            backgroundColor: this.props.hexCode
          }
        
        var boxClass = "";
        for (var i = 0; i < this.props.rows; i++) {
            for (var j = 0; j < this.props.cols; j++) { 
                let boxID = i + "_" + j;

                boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
                rowsArr.push(
                    <Box
                    boxClass={boxClass}
                    key={boxID}
                    boxID={boxID}
                    row={i}
                    col={j}
                    selectBox={this.props.selectBox}
                    style={this.style}
                    />
                );

            
        }
    }
        return ( 
            <div className="grid" style={{width: width}}>
            <div style={style}>
                {rowsArr}
                <button className = "center btn btn-default" onClick={this.newColour}>Colour </button>
                </div>
            </div> 
            
        );
    }
}

//BUTTON TOOLBAR
class Buttons extends React.Component {

    render() {
        return(
            <div className="center">
                <ButtonToolbar>
                    <button className = "btn btn-default" onClick={this.props.playButton}>
                        Play
                    </button>
                    <button className = "btn btn-default" onClick={this.props.pauseButton}>
                        Pause
                    </button>
                    <button className = "btn btn-default" onClick={this.props.clear}>
                        Clear
                    </button>
                    <button className = "btn btn-default" onClick={this.props.generate}>
                        Generate
                    </button>
                </ButtonToolbar>
                
            </div>
        )
    }
}

//MAIN APP 
class MainPage extends React.Component {
    constructor() {
        super();
        this.speed = 100;
        this.rows = 30;
        this.cols = 50;
        
        this.state = {
            generation: 0,
            gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false)),
            colorsNum: 1,
            colors: []
        }
        for (let i = 0; i < this.state.colorsNum; i +=1) {
            this.state.colors.push({hexCode: this.generateColor()});
          }
    }

    selectBox = (row, col) => {
        let gridCopy = arrayClone(this.state.gridFull);
        gridCopy[row][col] = !gridCopy[row][col];
        this.setState({
            gridFull: gridCopy
        });
    }

    generate = () => {
        let gridCopy = arrayClone(this.state.gridFull);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if(Math.floor(Math.random() * 4) === 1) {
                    gridCopy[i][j] = true;
                }
            }
        }
        this.setState({
            gridFull: gridCopy
        });
    }

    generateColor = () => {
        return '#' +  Math.random().toString(16).substr(-6);
    }
            
    updateColor = (index) => {
        let colors = this.state.colors.slice();
        const currentColor = this.generateColor();
        colors[index].hexCode = currentColor;
        this.setState({
        colors : colors
        });
    }

    playButton = () => {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.play, this.speed);
    }

    pauseButton = () => {
        clearInterval(this.intervalId);
    }

    clear = () => {
        var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        this.setState({
            gridFull: grid,
            generation: 0
        });
    }
    
    play = () => {
        let g = this.state.gridFull;
        let g2 = arrayClone(this.state.gridFull);

        //GAME OF LIFE RULES
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                //count is neighbours
                let count = 0;
                //each count has 8 potential neighbours
                if (i > 0) if (g[i - 1][j]) count++;
                if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
                if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
                if (j < this.cols - 1) if (g[i][j + 1]) count++;
                if (j > 0) if (g[i][j - 1]) count++;
                if (i < this.rows - 1) if (g[i + 1][j]) count++;
                if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
                if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
                //does the cell die or live?
                if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
                if (!g[i][j] && count === 3) g2[i][j] = true;
            }
        }
        this.setState({
            gridFull: g2,
            generation: this.state.generation + 1
        });
    }

    componentDidMount() {
        this.generate();
        this.playButton();
    }

    render(){
        return (
            <div>
                <h1>The Game of Life</h1>
                <div class="center"> { this.state.colors.map((color, index) => 
                <Grid 
                key={`color-${index}`} 
                index={index} 
                update={this.updateColor.bind(this)} 
                hexCode={color.hexCode}
                gridFull={this.state.gridFull}
                rows={this.rows}
                cols={this.cols}
                selectBox={this.selectBox}
                >  
                </Grid>) }
                </div> 
                <h3>Generations: {this.state.generation}</h3>
                <Buttons
                playButton={this.playButton}
                pauseButton={this.pauseButton}
                clear={this.clear}
                generate={this.generate}
                />
                <br>
                </br>
                <h4>by Chloe Williams</h4>
                <Rules></Rules>
            </div>
        );
    }
}

//need to clone as nested Array
function arrayClone(arr) {
    return JSON.parse(JSON.stringify(arr))
}

 ReactDOM.render(<MainPage/>, document.getElementById('root'));