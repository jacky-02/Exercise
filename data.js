const companyLawData = [
  {
    article: 1,
    cn: "为了规范公司的组织和行为，保护公司、股东、职工和债权人的合法权益，完善中国特色现代企业制度，弘扬企业家精神，维护社会经济秩序，促进社会主义市场经济的发展，根据宪法，制定本法。",
    en: "This Law is enacted in accordance with the Constitution for the purposes of regulating the organization and conduct of companies, protecting the lawful rights and interests of companies, shareholders, employees, and creditors, improving the modern enterprise system with Chinese characteristics, upholding the entrepreneurial spirit, maintaining the socialist economic order, and promoting the development of the socialist market economy."
  },
  {
    article: 2,
    cn: "本法所称公司，是指依照本法在中华人民共和国境内设立的有限责任公司和股份有限公司。",
    en: "For the purposes of this Law, \"company\" means a limited liability company or a corporation formed in the territory of the People's Republic of China in accordance with this Law."
  },
  {
    article: 3,
    cn: "公司是企业法人，有独立的法人财产，享有法人财产权。公司以其全部财产对公司的债务承担责任。公司的合法权益受法律保护，不受侵犯。",
    en: "A company is an enterprise as a legal person, has independent property as a legal person, and has property rights as a legal person. A company is liable for its debts with all its property. The lawful rights and interests of a company are protected by the law, and may not be infringed upon."
  },
  {
    article: 4,
    cn: "有限责任公司的股东以其认缴的出资额为限对公司承担责任；股份有限公司的股东以其认购的股份为限对公司承担责任。公司股东对公司依法享有资产收益、参与重大决策和选择管理者等权利。",
    en: "The shareholders of a limited liability company are liable to the company to the extent of their respective subscribed capital contributions. The shareholders of a corporation are liable to the corporation to the extent of their respective subscribed shares. The shareholders of a company are entitled to return on assets, participation in important decision-making, and selection of the managers, among others, of the company in accordance with the law."
  },
  {
    article: 5,
    cn: "设立公司应当依法制定公司章程。公司章程对公司、股东、董事、监事、高级管理人员具有约束力。",
    en: "In the formation of a company, the company bylaws (\"company bylaws\") shall be developed in accordance with the law. The company bylaws are binding on the company and its shareholders, directors, supervisors, and senior executives."
  },
  {
    article: 6,
    cn: "公司应当有自己的名称。公司名称应当符合国家有关规定。公司的名称权受法律保护。",
    en: "A company shall have its own name. The name of a company shall conform to the relevant provisions issued by the state. The right to name of a company is protected by the law."
  },
  {
    article: 7,
    cn: "依照本法设立的有限责任公司，应当在公司名称中标明有限责任公司或者有限公司字样。依照本法设立的股份有限公司，应当在公司名称中标明股份有限公司或者股份公司字样。",
    en: "A limited liability company formed in accordance with this Law shall include the words \"Limited Liability Company\" or \"Limited Company\" in its name. A corporation formed in accordance with this Law shall include the word \"Corporation\" or \"Corp.\" in its name."
  },
  {
    article: 8,
    cn: "公司以其主要办事机构所在地为住所。",
    en: "The domicile of a company is the place of its principal office."
  },
  {
    article: 9,
    cn: "公司的经营范围由公司章程规定。公司可以修改公司章程，变更经营范围。公司的经营范围中属于法律、行政法规规定须经批准的项目，应当依法经过批准。",
    en: "The business scope of a company is prescribed in the company bylaws. A company may modify its business scope by amending its bylaws. Where any item in the business scope of a company is subject to approval in accordance with a law or administrative regulation, it shall be legally approved."
  },
  {
    article: 10,
    cn: "公司的法定代表人按照公司章程的规定，由代表公司执行公司事务的董事或者经理担任。担任法定代表人的董事或者经理辞任的，视为同时辞去法定代表人。法定代表人辞任的，公司应当在法定代表人辞任之日起三十日内确定新的法定代表人。",
    en: "A director or the president of a company who represents the company in executing the affairs of the company serves as the legal representative of the company in accordance with the company bylaws. Where the director or president serving as the legal representative resigns, the director or president is deemed to have concurrently resigned from the office of the legal representative. Where the legal representative resigns, the company shall determine a new legal representative within 30 days of resignation of the legal representative."
  },
  {
    article: 11,
    cn: "法定代表人以公司名义从事的民事活动，其法律后果由公司承受。公司章程或者股东会对法定代表人职权的限制，不得对抗善意相对人。法定代表人因执行职务造成他人损害的，由公司承担民事责任。公司承担民事责任后，依照法律或者公司章程的规定，可以向有过错的法定代表人追偿。",
    en: "The legal consequences of civil activities performed by the legal representative of a company in the name of the company shall be assumed by the company. Any restriction on the power of the legal representative imposed by the company bylaws or the shareholders' meeting may not be set up against a bona fide opposite party. Where the legal representative causes any harm to any other person for execution of his or her functions, the company shall assume civil liability for such harm. The company may, after assuming civil liability, recover loss from the legal representative at fault in accordance with laws or its bylaws."
  },
  {
    article: 12,
    cn: "有限责任公司变更为股份有限公司，应当符合本法规定的股份有限公司的条件。股份有限公司变更为有限责任公司，应当符合本法规定的有限责任公司的条件。有限责任公司变更为股份有限公司的，或者股份有限公司变更为有限责任公司的，公司变更前的债权、债务由变更后的公司承继。",
    en: "Where a limited liability company is modified into a corporation, it shall meet the conditions set out in this Law for a corporation. Where a corporation is modified into a limited liability company, it shall meet the conditions set out in this Law for a limited liability company. Where a limited liability company is modified into a corporation or a corporation is modified into a limited liability company, the company after the modification shall succeed to the claims and debts of the company before the modification."
  },
  {
    article: 13,
    cn: "公司可以设立子公司。子公司具有法人资格，依法独立承担民事责任。公司可以设立分公司，分公司不具有法人资格，其民事责任由公司承担。",
    en: "A company may form subsidiaries. A subsidiary has the status of a legal person, and assumes civil liabilities independently in accordance with the law. A company may form branches, which do not have the status of a legal person, and their civil liabilities shall be assumed by the company."
  },
  {
    article: 14,
    cn: "公司可以向其他企业投资。法律规定公司不得成为对所投资企业的债务承担连带责任的出资人的，从其规定。",
    en: "A company may invest in other enterprises. Where a law provides that a company may not become a capital contributor that is jointly and severally liable for the debts of the investee, such provision of the law applies."
  },
  {
    article: 15,
    cn: "公司向其他企业投资或者为他人提供担保，按照公司章程的规定，由董事会或者股东会决议；公司章程对投资或者担保的总额及单项投资或者担保的数额有限额规定的，不得超过规定的限额。公司为公司股东或者实际控制人提供担保的，应当经股东会决议。前款规定的股东或者受前款规定的实际控制人支配的股东，不得参加前款规定事项的表决。该项表决由出席会议的其他股东所持表决权的过半数通过。",
    en: "A resolution of the board of directors or the shareholders' meeting of a company shall be adopted in accordance with the company bylaws regarding any investment to be made by the company in any other enterprise or any security to be provided by the company for others. If the company bylaws prescribe a limit on the total amount of investment or security or on the amount of a single investment or security provided each time, the prescribed limit may not be exceeded. A resolution of the shareholders' meeting shall be adopted regarding any security to be provided by the company for a shareholder or the actual controller of the company. The shareholder as mentioned in the preceding paragraph or a shareholder dominated by the actual controller as mentioned in the preceding paragraph may not participate in voting on the matter as mentioned in the preceding paragraph. The resolution regarding the matter shall be adopted by more than half of the voting rights of the other shareholders present at the meeting."
  },
  {
    article: 16,
    cn: "公司应当保护职工的合法权益，依法与职工签订劳动合同，参加社会保险，加强劳动保护，实现安全生产。公司应当采用多种形式，加强公司职工的职业教育和岗位培训，提高职工素质。",
    en: "A company shall protect the lawful rights and interests of its employees, enter into labor contracts with its employees in accordance with the law, participate in social insurance, strengthen labor protection, and ensure work safety. A company shall, in multiple forms, strengthen the occupational education and in-service training of its employees, to improve the qualities of its employees."
  },
  {
    article: 17,
    cn: "公司职工依照《中华人民共和国工会法》组织工会，开展工会活动，维护职工合法权益，公司应当为本公司工会提供必要的活动条件。公司工会代表职工就职工的劳动报酬、工作时间、休息休假、劳动安全卫生和保险福利等事项依法与公司签订集体合同。公司依照宪法和有关法律的规定，建立健全以职工代表大会为基本形式的民主管理制度，通过职工代表大会或者其他形式，实行民主管理。公司研究决定改制、解散、申请破产以及经营方面的重大问题、制定重要的规章制度时，应当听取公司工会的意见，并通过职工代表大会或者其他形式听取职工的意见和建议。",
    en: "The employees of a company shall organize a labor union to carry out union activities and maintain the lawful rights and interests of the employees in accordance with the Labor Union Law of the People's Republic of China. The company shall provide necessary conditions for its labor union to carry out activities. The labor union shall, on behalf of employees, enter into a collective contract with the company on the remuneration, working hours, rest and leisure, work safety and health, and insurance benefits, among others, of employees in accordance with the law. In accordance with the Constitution and relevant laws, a company shall establish and improve a democratic management system in the primary form of assembly of representatives of employees, and implement democratic management through the assembly of representatives of employees or otherwise. In researching and deciding a systematic transformation, dissolution, a petition for bankruptcy, and major issues related to operations or developing any important rules and regulations, a company shall hear the opinions of its labor union, and hear the opinions and recommendations of its employees through the assembly of representatives of employees or otherwise."
  },
  {
    article: 18,
    cn: "在公司中，根据中国共产党章程的规定，设立中国共产党的组织，开展党的活动。公司应当为党组织的活动提供必要条件。",
    en: "An organization of the Communist Party of China shall be formed in a company in accordance with the Constitution of the Communist Party of China, to carry out activities of the Party. A company shall provide necessary conditions for the Party organization to carry out activities."
  },
  {
    article: 19,
    cn: "公司从事经营活动，应当遵守法律法规，遵守社会公德、商业道德，诚实守信，接受政府和社会公众的监督。",
    en: "In operations, a company shall comply with laws and regulations, observe social morality and business ethics, act in good faith, and accept supervision from the government and the public."
  },
  {
    article: 20,
    cn: "公司从事经营活动，应当充分考虑公司职工、消费者等利益相关者的利益以及生态环境保护等社会公共利益，承担社会责任。国家鼓励公司参与社会公益活动，公布社会责任报告。",
    en: "In operations, a company shall fully consider the interests of its employees, consumers, and other stakeholders and ecological and environmental protection and other public interests, and assume social responsibility. The state encourages a company to participate in public interest activities and disclose its social responsibility report to the public."
  },
  {
    article: 21,
    cn: "公司股东应当遵守法律、行政法规和公司章程，依法行使股东权利，不得滥用股东权利损害公司或者其他股东的利益。公司股东滥用股东权利给公司或者其他股东造成损失的，应当承担赔偿责任。",
    en: "A shareholder of a company shall comply with laws, administrative regulations, and the company bylaws, and exercise shareholder's rights in accordance with the law, and may not abuse shareholder's rights to harm the interests of the company or other shareholders. A shareholder of a company is liable in damages if any abuse of shareholder's rights by the shareholder causes any loss to the company or other shareholders."
  },
  {
    article: 22,
    cn: "公司的控股股东、实际控制人、董事、监事、高级管理人员不得利用关联关系损害公司利益。违反前款规定，给公司造成损失的，应当承担赔偿责任。",
    en: "The controlling shareholder, actual controller, directors, supervisors, and senior executives of a company may not take advantage of affiliation to harm the interests of the company. Those violating the provision of the preceding paragraph and causing any loss to the company are liable in damages."
  },
  {
    article: 23,
    cn: "公司股东滥用公司法人独立地位和股东有限责任，逃避债务，严重损害公司债权人利益的，应当对公司债务承担连带责任。股东利用其控制的两个以上公司实施前款规定行为的，各公司应当对任一公司的债务承担连带责任。只有一个股东的公司，股东不能证明公司财产独立于股东自己的财产的，应当对公司债务承担连带责任。",
    en: "Where a shareholder of a company evades debts by abusing the status of the company as an independent legal person or a shareholder's limited liability, seriously damaging the interests of the creditors to the company, the shareholder is jointly and severally liable for the debts of the company. Where a shareholder uses two or more companies under its control to commit the conduct in the preceding paragraph, each company is jointly and severally liable for the debts of any of the other companies. Where the shareholder of a company that has a single shareholder is unable to prove that the property of the company is independent from the shareholder's own property, the shareholder is jointly and severally liable for the debts of the company."
  },
  {
    article: 24,
    cn: "公司股东会、董事会、监事会召开会议和表决可以采用电子通信方式，公司章程另有规定的除外。",
    en: "The holding of a shareholders' meeting, a meeting of the board of directors, and a meeting of the board of supervisors of a company and the voting at the meetings may be in the manner of electronic communication, except as otherwise prescribed in the company bylaws."
  },
  {
    article: 25,
    cn: "公司股东会、董事会的决议内容违反法律、行政法规的无效。",
    en: "Any content in violation of a law or administrative regulation of a resolution of the shareholders' meeting or the board of directors of a company is void."
  },
  {
    article: 26,
    cn: "公司股东会、董事会的会议召集程序、表决方式违反法律、行政法规或者公司章程，或者决议内容违反公司章程的，股东自决议作出之日起六十日内，可以请求人民法院撤销。但是，股东会、董事会的会议召集程序或者表决方式仅有轻微瑕疵，对决议未产生实质影响的除外。未被通知参加股东会会议的股东自知道或者应当知道股东会决议作出之日起六十日内，可以请求人民法院撤销；自决议作出之日起一年内没有行使撤销权的，撤销权消灭。",
    en: "Where the convening procedure or the voting manner for a shareholders' meeting or a meeting of the board of directors of a company is in violation of a law, an administrative regulation, or the company bylaws or any content of a resolution is in violation of the company bylaws, a shareholder may, within 60 days of adoption of the resolution, petition a people's court to revoke the resolution, unless there is only a minor defect in the convening procedure or the voting manner for the shareholders' meeting or meeting of the board of directors, which does not have any substantive effect on the resolution. A shareholder not participating in the shareholders' meeting for not being notified of the meeting may, within 60 days of the day when the shareholder knows or should have known the adoption of the resolution, petition a people's court to revoke the resolution; and if the shareholder fails to exercise the right of revocation within one year of adoption of the resolution, the right of revocation is extinguished."
  },
  {
    article: 27,
    cn: "有下列情形之一的，公司股东会、董事会的决议不成立：(一)未召开股东会、董事会会议作出决议；(二)股东会、董事会会议未对决议事项进行表决；(三)出席会议的人数或者所持表决权数未达到本法或者公司章程规定的人数或者所持表决权数；(四)同意决议事项的人数或者所持表决权数未达到本法或者公司章程规定的人数或者所持表决权数。",
    en: "Under any of the following circumstances, a resolution of the shareholders' meeting or the board of directors of a company is not formed: (1) A resolution is adopted without the holding of a shareholders' meeting or a meeting of the board of directors. (2) The matters to be resolved are not voted on at a shareholders' meeting or a meeting of the board of directors. (3) The number of persons present at a meeting or the number of voting rights held by them is less than the number of persons or the number of voting rights held as prescribed in this Law or the company bylaws. (4) The number of persons voting for the matters to be resolved or the number of voting rights held by them is less than the number of persons or the number of voting rights held as prescribed in this Law or the company bylaws."
  },
  {
    article: 28,
    cn: "公司股东会、董事会决议被人民法院宣告无效、撤销或者确认不成立的，公司应当向公司登记机关申请撤销根据该决议已办理的登记。股东会、董事会决议被人民法院宣告无效、撤销或者确认不成立的，公司根据该决议与善意相对人形成的民事法律关系不受影响。",
    en: "Where a resolution of the shareholders' meeting or the board of directors of a company is declared void, is revoked, or is confirmed as not formed by a people's court, the company shall apply to the company registration authority for revocation of modification registration that has been undergone according to the resolution. Where a resolution of the shareholders' meeting or the board of directors is declared void, is revoked, or is confirmed as not formed by a people's court, it does not affect a civil legal relationship formed between the company and a bona fide opposite party according to the resolution."
  },
  {
    article: 29,
    cn: "设立公司，应当依法向公司登记机关申请设立登记。法律、行政法规规定设立公司必须报经批准的，应当在公司登记前依法办理批准手续。",
    en: "For the formation of a company, an application for formation registration shall be filed with the company registration authority. Where a law or administrative regulation provides that the formation of a company must be subject to approval, the approval formalities shall be undergone in accordance with the law before company registration."
  },
  {
    article: 30,
    cn: "申请设立公司，应当提交设立登记申请书、公司章程等文件，提交的相关材料应当真实、合法和有效。申请材料不齐全或者不符合法定形式的，公司登记机关应当一次性告知需要补正的材料。",
    en: "For the formation of a company, a written application for formation registration, the company bylaws, and other documents shall be submitted, and the relevant materials submitted shall be authentic, lawful, and valid. Where the application materials are incomplete or are not in the statutory form, the company registration authority shall notify the applicant of the needed additional materials at one time."
  }
];