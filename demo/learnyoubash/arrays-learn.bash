fruits[0]=Apple
fruits[1]=Pear
fruits[2]=Plum
echo ${fruits[*]}

meats=(Sheep Beef Pig)
echo ${meats[@]}

echo ${meats[*]:0:2}
echo ${@:1:2}

fruits=(Orange ${fruits[*]} Banana Cherry)
echo ${fruits[@]}

unset fruits[0]
echo ${fruits[*]}
