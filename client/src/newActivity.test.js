import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Creador from './components/Creador/Creador';

test('Activity Form testing',()=>{
  const countries = [{name:"Argentina",id:'ARG'}, {name:"Chile",id:'CHL'}]
  const component = render(<Creador props={countries}/>)
  //const button = component.getBy
  component.debug()
});