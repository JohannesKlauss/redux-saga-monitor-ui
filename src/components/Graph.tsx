import React, {useEffect} from 'react';
import cytoscape from 'cytoscape';
import './Graph.css';
import {useSelector} from "react-redux";

const Graph: React.FC = () => {
  useEffect(() => {
    cytoscape({

      container: document.getElementById('cy'), // container to render in

      elements: [ // list of graph elements to start with
        { // node a
          data: { id: 'a' }
        },
        { // node b
          data: { id: 'b' }
        },
        { // edge ab
          data: { id: 'ab', source: 'a', target: 'b' }
        }
      ],

      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(id)'
          }
        },

        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],

      layout: {
        name: 'grid',
        rows: 1
      }

    });
  }, []);

  const state = useSelector(state => state);

  console.log(state);

  return (
    <div className="container" id="cy">
    </div>
  );
};

export default Graph;