import React, { memo, } from "react";
import A from "@Components/A";
import { Col, Row } from 'antd';
import IntlMessages from "@Components/Utility/intlMessages";

const ListMenu = memo(({ data, onEditItem }) => {
	const styleLabelParent = {
		fontWeight: 'bold', fontSize: 20, textAlign: 'center', backgroundColor: 'rgb(242, 243, 248)', paddingTop: 7, paddingBottom: 7
	}


  	return (
		<div className="thumnail">
			<div style={styleLabelParent}>Menu Web: </div>
			<Row gutter={16}>
				{
					data.map((item) => (
						<Col span={8}>
							<div>
								<div 
									style={{fontWeight: 'bold', color: '#000', display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center',
										fontSize: 18, paddingLeft: 10, marginVertical: 10}}>
									<div>
										{item.name}
									</div>
								</div>
								<div className="pl-4">
									{
										item.subs && item.subs.map((itemChilds) => (
											<div>
												<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
													<div style={{fontSize: 16}}>
														<IntlMessages id={itemChilds.name}/>
													</div>
													<A
														onClick={(e) => {
															onEditItem(itemChilds.uuid)
														}}
														title="Sửa role"
														className="fa fa-edit pr-2"
													/>
												</div>
												<div className="pl-4">
													{
														itemChilds.hasSub && itemChilds.subs.map((itemC) => (
															<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
																<div>
																	<IntlMessages id={itemC.name}/>
																</div>
																<A
																	onClick={(e) => {
																		onEditItem(itemC.uuid)
																	}}
																	title="Sửa role"
																	className="fa fa-edit pr-2"
																/>
															</div>
														))
													}
												</div>
											</div>
										))
									}
								</div>
							</div>
						</Col>
					))
				}	
			</Row>
		</div>
  	);
});
export default ListMenu;
