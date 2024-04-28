import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  myDiagram: any;
  secondDiagram: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initDiagram();
    let myAnimation: any = null;
    myAnimation = new go.Animation();
    myAnimation.easing = go.Animation.EaseLinear;
    this.myDiagram.links.each((link: any) => myAnimation.add(link.findObject('PIPE'), 'strokeDashOffset', 20, 0));
    myAnimation.runCount = Infinity;
    myAnimation.start();

  }

  private initDiagram(): void {
    const $ = go.GraphObject.make;

    this.myDiagram = new go.Diagram('diagramDiv', {
      'grid.visible': true,
      'grid.gridCellSize': new go.Size(30, 20),
      'draggingTool.isGridSnapEnabled': true,
      'resizingTool.isGridSnapEnabled': true,
      'rotatingTool.snapAngleMultiple': 90,
      'rotatingTool.snapAngleEpsilon': 45,
      'undoManager.isEnabled': true,
      'diagram.isEnabled': false
    });

    this.myDiagram.nodeTemplateMap.add(
      'Process',
      $(go.Node,
        'Auto',
        {
          locationSpot: new go.Spot(0.5, 0.5),
          locationObjectName: 'SHAPE',
          resizable: true,
          resizeObjectName: 'SHAPE',
        },
        new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape,
          'RoundedRectangle',
          {
            name: 'SHAPE',
            width: 100,
            height: 50,
            strokeWidth: 2,
            fill: $(go.Brush, 'Linear', {
              start: go.Spot.Left,
              end: go.Spot.Right,
              0: 'gray',
              0.5: 'white',
              1: 'gray',
            }),
            minSize: new go.Size(50, 50),
            portId: '',
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides,
          },
          new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)
        ),
        $(go.TextBlock,
          {
            alignment: go.Spot.Center,
            textAlign: 'center',
            margin: 5,
            editable: false,
          },
          new go.Binding('text').makeTwoWay()
        )
      )
    );

    this.myDiagram.nodeTemplateMap.add(
      'Thermometer',
      $(go.Node,
        'Auto',
        {
          locationSpot: new go.Spot(0.5, 0.5),
          locationObjectName: 'SHAPE',
          resizable: true,
          resizeObjectName: 'SHAPE',
        },
        new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.TextBlock, { font: "bold 16px sans-serif", stroke: "white" }, new go.Binding("text", "temperature"))
      )
    );

    this.myDiagram.linkTemplate = $(go.Link,
      { routing: go.Routing.AvoidsNodes, curve: go.Curve.JumpGap, corner: 10, reshapable: true, toShortLength: 7 },
      new go.Binding('points').makeTwoWay(),
      $(go.Shape, { isPanelMain: true, stroke: 'black', strokeWidth: 7 }),
      $(go.Shape, { isPanelMain: true, stroke: 'gray', strokeWidth: 5 }),
      $(go.Shape, { isPanelMain: true, stroke: 'white', strokeWidth: 3, name: 'PIPE', strokeDashArray: [10, 10] }),
      $(go.Shape, { toArrow: 'Triangle', scale: 2, fill: 'gray', stroke: null })
    );

    this.myDiagram.model = go.Model.fromJson(
      { "class": "go.GraphLinksModel",
        "nodeDataArray": [
          {"key":"P1", "category":"Process", "pos":"0 120", "text":"DHT 11"},
          {"key":"P2", "category":"Process", "pos":"0 320", "text":"Arduino UNO"},
          {"key":"P3", "category":"Process", "pos":"250 320", "text":"ESP 32"},
          {"key":"P4", "category":"Process", "pos":"250 120", "text":"Server"},
          {"key":"P5", "category":"Process", "pos":"500 120", "text":"Web App"},
          { key: 6, category: "Thermometer", "pos":"500 320", temperature: "25°C" }
        ],
        "linkDataArray": [
          {"from":"P1", "to":"P2"},
          {"from":"P2", "to":"P3"},
          {"from":"P3", "to":"P4"},
          {"from":"P4", "to":"P5"},
          {"from":"P5", "to":6},
        ]}
    )
  }

  saveDiagram() {
    console.log(this.myDiagram)
  }

  updateTemperature() {
    const model = this.myDiagram.model;
    if (model) {
      const thermometerNode = model.findNodeDataForKey(6); // Assurez-vous de sélectionner le nœud correct
      if (thermometerNode) {
        this.myDiagram.model.setDataProperty(thermometerNode, 'temperature', `${20}°C`);
      }
    }
  }
}
