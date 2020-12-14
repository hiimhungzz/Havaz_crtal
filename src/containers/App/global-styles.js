import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  .mark-required-color {
    color: #fd397a;
    margin-left:5px;
  }
  .ant-calendar-picker-icon{
    display:flex;
  }
  .ant-input-number{
      width: 100% !important;
      .ant-input-number-handler-wrap {
        display: none;
    }
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  label{
    color: rgba(0, 0, 0, 0.85);
    font-weight: 400;
    font-size: 13px;
    margin-bottom:0;
  }
  #kt_header,#kt_subheader,#kt_footer{
    z-index:301 !important;
  }
  .table th, .table td {
    padding: 0.25rem;
    vertical-align: top;
    border-top: 1px solid #ebedf2;
  }
  .ant-input-number-input{
    padding: 0 5px !important;
  }
  input.border-invalid,
  .border-invalid .ant-select-selection,
  .ant-input-number.border-invalid,
  .border-invalid .ant-calendar-picker-input,
  .border-invalid .ant-time-picker-input,
  .border-invalid .ant-input
  {
    border: 1px solid #fd397a !important;
    box-shadow: 0 0 0 2px white !important;
  }
  .anticon.anticon-caret-down{
    vertical-align:middle;
  }
`;
export default GlobalStyle;
