import os
from flask import Blueprint, render_template, redirect, url_for, request, send_from_directory
import pandas as pd
user_route = Blueprint('user_route', __name__)
img_dir = './app/main/static/image/'
rank = pd.read_csv('./app/main/static/files/rank.csv')
board = pd.read_csv('./app/main/static/files/board.csv')
board = board.fillna('')
facility = pd.read_csv('./app/main/static/files/facility.csv')

@user_route.route('/', methods=['GET'])
def main():
  main_rank = rank.copy()
  main_rank = main_rank.sort_values(by=['DMAND_MVM_ITEM_IDEX_RANK_CO'], ascending=[True]).head(10)
  main_board = board.copy()
  main_board = main_board.loc[[22, 36, 49, 57],['CLUB_NM', 'OPER_TIME_CN', 'CLUB_INTRCN_CN']]
  main_board.index=[1, 2, 3, 4]
  column_list = ['CLUB_NM', 'OPER_TIME_CN', "CLUB_INTRCN_CN"]
  return render_template('index.html', title="메인", rank=main_rank, board=main_board, column_list=column_list)


# @user_route.route('/club', methods=['GET'])
# @user_route.route('/club/', methods=['GET'])
# def club():
#   nBoard = board.copy()
#   return render_template('club.html', board=nBoard)


@user_route.route('/boards/<string:clubNmTm>', methods=['GET'])
def club_detail(clubNmTm):
  data = board.copy()
  club = clubNmTm.split("+")
  new_data = data.loc[(data['CLUB_NM'] == club[0]) & (data['OPER_TIME_CN'] == club[1])]

  itemNm = new_data['ITEM_NM'].values[0]
  subNm = new_data['SUBITEM_NM'].values[0]

  # 이미지 파일 유무 확인
  imgNm = None
  if os.path.isfile(img_dir + itemNm + ".jpg"):
    imgNm = itemNm
  elif os.path.isfile(img_dir + subNm + ".jpg"):
    imgNm = subNm

  return render_template('board-detail.html', board=new_data.values, imgNm=imgNm)

@user_route.app_errorhandler(404)
def not_find(err):
  return render_template('common/404.html', title="404"), 404

@user_route.app_errorhandler(500)
def internal_error(err):
  return render_template('common/500.html', title="500"), 500

@user_route.route('/club', methods=['GET'])
def club():
  club_info = board.copy()
  club_info = club_info[['CTPRVN_NM', 'SIGNGU_NM', 'ITEM_NM', 'TROBL_TY_NM', 'CLUB_NM', ]]
  club_info = club_info.fillna("-")

  return render_template('club.html', title="동호회", club_info=club_info)

@user_route.route('/filter', methods=['GET','POST'])
def filter():
  select1 = request.form.get('areas')
  select2 = request.form.get('sports')
  name=request.form.get('name')
  club_info = board.copy()
  club_info = club_info[['CTPRVN_NM', 'SIGNGU_NM', 'ITEM_NM', 'TROBL_TY_NM', 'CLUB_NM', ]]
  club_info = club_info.fillna("-")
  conta1 = club_info['CTPRVN_NM'].str.contains(select1)
  conta2 = club_info['ITEM_NM'].str.contains(select2)
  club_name = club_info['CLUB_NM'].str.contains(name)


  if select1 =='전체' :
    conta1 = True
  if select2 == '전체' :
    conta2 = True
  if name =='':
    club_name = True
  condi = conta1 &conta2&club_name
  club_info2 = club_info[condi]
  return render_template('club.html', title="동호회", club_info=club_info2)