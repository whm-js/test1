var G_MedicalEthicsData = [
	{
		"ItemID":1,
		"ItemName" : "服务态度医患关系",
		"Explain" : "",
		"ItemList" : [{
				"FromType" : "radio",
				"OptionID":1,
				"OptionName" : "服务态度",
				"OptionValue" : "",
				"OptionGrade" : ["优秀", "良好", "一般", "差"],
				"IsAdd" : false
			}, {
				"FromType" : "radio",
				"OptionID":2,
				"OptionName" : "患者投诉",
				"OptionGrade" : ["无", "有"],
				"OptionValue" : "",
				"IsAdd" : true
			}
		]
	}, {
		"ItemID":2,
		"ItemName" : "团队协作遵守制度",
		"Explain" : "",
		"ItemList" : [{
				"FromType" : "radio",
				"OptionID":1,
				"OptionName" : "",
				"OptionValue" : "",
				"OptionGrade" : ["优秀", "良好", "一般", "差"],
				"IsAdd" : false
			}
		]
	}, {
		"ItemID":3,
		"ItemName" : "工作责任心",
		"Explain" : "",
		"ItemList" : [{
				"FromType" : "radio",
				"OptionID":1,
				"OptionName" : "责任心",
				"OptionValue" : "",
				"OptionGrade" : ["优秀", "良好", "一般", "差"],
				"IsAdd" : false
			}, {
				"FromType" : "radio",
				"OptionID":2,
				"OptionName" : "差错",
				"OptionGrade" : ["无", "有"],
				"OptionValue" : "",
				"IsAdd" : true
			}
		]
	}, {
		"ItemID":4,
		"ItemName" : "医疗作风廉洁行医",
		"Explain" : "",
		"ItemList" : [{
				"FromType" : "radio",
				"OptionID":1,
				"OptionName" : "",
				"OptionValue" : "",
				"OptionGrade" : ["优秀", "良好", "一般", "差"],
				"IsAdd" : false
			}
		]
	}, {
		"ItemID":5,
		"ItemName" : "医疗文书完成情况",
		"Explain" : "",
		"ItemList" : [{
				"FromType" : "radio",
				"OptionID":1,
				"OptionName" : "完成质量",
				"OptionValue" : "",
				"OptionGrade" : ["优秀", "良好", "一般", "差"],
				"IsAdd" : false
			}, {
				"FromType" : "radio",
				"OptionID":2,
				"OptionName" : "是否按时",
				"OptionValue" : "",
				"OptionGrade" : ["按时完成", "不按时完成"],
				"IsAdd" : false
			}, {
				"FromType" : "radio",
				"OptionID":3,
				"OptionName" : "丙级病历",
				"OptionGrade" : ["无", "有"],
				"OptionValue" : "",
				"IsAdd" : false
			}, {
				"FromType" : "input",
				"OptionID":4,
				"OptionName" : "完成手写大病历份数",
				"OptionValue" : "",
				"Unit" : "份（必须≥3份，基地留存）"
			}
		]
	}, {
		"ItemID":6,
		"ItemName" : "教学能力",
		"Explain" : "（有处方权医师填写）",
		"ItemList" : [{
				"FromType" : "radio",
				"OptionID":1,
				"OptionName" : "是否带实习生查房",
				"OptionGrade" : ["无", "有"],
				"OptionValue" : "",
				"IsAdd" : true
			}, {
				"FromType" : "radio",
				"OptionID":2,
				"OptionName" : "科室小讲堂",
				"OptionGrade" : ["无", "有"],
				"OptionValue" : "",
				"IsAdd" : true
			}
		]
	}, {
		"ItemID":7,
		"ItemName" : "辅助科室轮转",
		"Explain" : "",
		"ItemList" : [{
				"FromType" : "radio",
				"OptionID":1,
				"OptionName" : "阅片读图学习情况",
				"OptionValue" : "",
				"OptionGrade" : ["优秀", "良好", "一般", "差"],
				"IsAdd" : false
			}, {
				"FromType" : "input",
				"OptionID":2,
				"OptionName" : "数学图/片诊断报告",
				"OptionValue" : "",
				"Unit" : "份"
			}
		]
	}, {
		"ItemID":8,
		"ItemName" : "轮转该科期间科研能力",
		"Explain" : "",
		"ItemList" : [{
				"FromType" : "input",
				"OptionID":1,
				"OptionName" : "完成科研申报",
				"OptionValue" : "",
				"Unit" : "项",
				"isRight":"left"
			}, {
				"FromType" : "input",
				"OptionID":2,
				"OptionName" : "（排名",
				"OptionValue" : "",
				"Unit" : "）",
				"isRight":"right"
			}, {
				"FromType" : "input",
				"OptionID":3,
				"OptionName" : "完成课题结题",
				"OptionValue" : "",
				"Unit" : "项",
				"isRight":"left"
			}, {
				"FromType" : "input",
				"OptionID":4,
				"OptionName" : "（排名",
				"OptionValue" : "",
				"Unit" : "）",
				"isRight":"right"
			}, {
				"FromType" : "input",
				"OptionID":5,
				"OptionName" : "完成论文撰写",
				"OptionValue" : "",
				"Unit" : "篇，交科教部"
			}, {
				"FromType" : "input",
				"OptionID":6,
				"OptionName" : "发表论文",
				"OptionValue" : "",
				"Unit" : "篇，交科教部"
			}
		]
	}, {
		"ItemID":9,
		"ItemName" : "操作完成情况",
		"Explain" : "",
		"ItemList" : [{
				"FromType" : "radio",
				"OptionID":1,
				"OptionName" : "遵守操作规范情况",
				"OptionValue" : "",
				"OptionGrade" : ["能", "不能"],
				"IsAdd" : false
			}, {
				"FromType" : "input",
				"OptionID":2,
				"OptionName" : "参加完成专业操作",
				"OptionValue" : "",
				"Unit" : "项次"
			}, {
				"FromType" : "radio",
				"OptionID":3,
				"OptionName" : "完成质量",
				"OptionValue" : "",
				"OptionGrade" : ["优秀", "良好", "一般", "差"],
				"IsAdd" : false
			}
		]
	}, {
		"ItemID":10,
		"ItemName" : "临床能力",
		"Explain" : "",
		"ItemList" : [{
				"FromType" : "radio",
				"OptionID":1,
				"OptionName" : "处理一般病人能力",
				"OptionValue" : "",
				"OptionGrade" : ["优秀", "良好", "一般", "差"],
				"IsAdd" : false
			}, {
				"FromType" : "radio",
				"OptionID":2,
				"OptionName" : "抢救危重病人能力",
				"OptionValue" : "",
				"OptionGrade" : ["优秀", "良好", "一般", "差"],
				"IsAdd" : false
			}, {
				"FromType" : "radio",
				"OptionID":3,
				"OptionName" : "诊治疑难病人能力",
				"OptionValue" : "",
				"OptionGrade" : ["优秀", "良好", "一般", "差"],
				"IsAdd" : false
			}
		]
	}, {
		"ItemID":11,
		"ItemName" : "参加病区值班情况",
		"Explain" : "",
		"ItemList" : [{
				"FromType" : "input",
				"OptionID":1,
				"OptionName" : "参加值夜班",
				"OptionValue" : "",
				"Unit" : "次"
			}, {
				"FromType" : "input",
				"OptionID":2,
				"OptionName" : "独立值夜班",
				"OptionValue" : "",
				"Unit" : "次"
			}
		]
	}, {
		"ItemID":12,
		"ItemName" : "管床情况",
		"Explain" : "",
		"ItemList" : [{
				"FromType" : "input",
				"OptionID":1,
				"OptionName" : "参加独立管床",
				"OptionValue" : "",
				"Unit" : "张",
				"isRight":"left"
			}, {
				"FromType" : "input",
				"OptionID":2,
				"OptionName" : "床号",
				"OptionValue" : "",
				"Unit" : "",
				"isRight":"right"
			}, {
				"FromType" : "input",
				"OptionID":3,
				"OptionName" : "独立管床",
				"OptionValue" : "",
				"Unit" : "张",
				"isRight":"left"
			}, {
				"FromType" : "input",
				"OptionID":4,
				"OptionName" : "床号",
				"OptionValue" : "",
				"Unit" : "",
				"isRight":"right"
			}
		]

	}, {
		"ItemID":13,
		"ItemName" : "参加科室业务学习情况",
		"Explain" : "",
		"ItemList" : [{
				"FromType" : "input",
				"OptionID":1,
				"OptionName" : "教学查房",
				"OptionValue" : "",
				"Unit" : "次"
			}, {
				"FromType" : "input",
				"OptionID":2,
				"OptionName" : "小讲课",
				"OptionValue" : "",
				"Unit" : "次"
			}, {
				"FromType" : "input",
				"OptionID":3,
				"OptionName" : "病历讨论",
				"OptionValue" : "",
				"Unit" : "次"
			}
		]
	}, {
		"ItemID":14,
		"ItemName" : "参加院级以上学术活动情况",
		"Explain" : "",
		"ItemList" : [{
				"FromType" : "input",
				"OptionID":1,
				"OptionName" : "医院",
				"OptionValue" : "",
				"Unit" : "次"
			}, {
				"FromType" : "input",
				"OptionID":2,
				"OptionName" : "市级",
				"OptionValue" : "",
				"Unit" : "次"
			}, {
				"FromType" : "input",
				"OptionID":3,
				"OptionName" : "省级",
				"OptionValue" : "",
				"Unit" : "次"
			}
		]
	}, {
		"ItemID":15,
		"ItemName" : "外语学习情况",
		"Explain" : "",
		"ItemList" : [{
				"FromType" : "input",
				"OptionID":1,
				"OptionName" : "语种",
				"OptionValue" : "",
				"Unit" : ""
			}, {
				"FromType" : "input",
				"OptionID":2,
				"OptionName" : "阅读外语文献",
				"OptionValue" : "",
				"Unit" : "篇"
			}, {
				"FromType" : "input",
				"OptionID":3,
				"OptionName" : "单词数",
				"OptionValue" : "",
				"Unit" : "个"
			}
		]
	}, {
		"ItemID":16,
		"ItemName" : "专业文献学习",
		"Explain" : "",
		"ItemList" : [{
				"FromType" : "input",
				"OptionID":1,
				"OptionName" : "阅读专业文献",
				"OptionValue" : "",
				"Unit" : "篇"
			}, {
				"FromType" : "input",
				"OptionID":2,
				"OptionName" : "读书笔记",
				"OptionValue" : "",
				"Unit" : "篇"
			}
		]
	}
]
export {
    G_MedicalEthicsData
}