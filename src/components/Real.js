import React, { PureComponent } from "react";
import { XAxis, CartesianGrid, Tooltip, Line, LineChart } from "recharts";

import { ForecastContext } from "../ForecastContext";

export default class Real extends PureComponent {
  //   static jsfiddleUrl = "https://jsfiddle.net/alidingling/30763kr7/";
  static contextType = ForecastContext;

  constructor(props) {
    super(props);
    this.state = {
      // property: props,
      // liveData: this.props.dailyData,
    };
    // data.daily[0].temp
    // console.log(this.myData());
  }

  render() {
    // console.log("fat one", this.context);
    // this.context.setForc(this.context[0]);
    return (
      <LineChart
        width={700}
        height={400}
        data={this.context[0]}
        // margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line type="monotone" dataKey="High" stroke="#ff7300" yAxisId={0} />
        <Line type="monotone" dataKey="Low" stroke="#387908" yAxisId={1} />
        <Line type="monotone" dataKey="Des" stroke="#387908" yAxisId={2} />
      </LineChart>
    );
  }
}
