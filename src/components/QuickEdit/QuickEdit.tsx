import * as React from 'react';
import styled from 'styled-components';
import { Field } from '../Edit';

const Edit = styled.div`
  width: 100%;
  input {
    width: 100%;
    max-width: 80px;
  }
`;

interface Props {
  id: number;
  column: string;
  value: string;
}
export default ({ id, column, value }: Props) => (
  <Edit>
    <Field
      tableName='order'
      table={`order:${id}`}
      column={column}
      defaultValue={value}
    />
  </Edit>
);
