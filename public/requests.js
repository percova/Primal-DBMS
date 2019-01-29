$('document').ready(function() {
    function parse(data) {
        let parsedData = JSON.parse(data);
        console.log(parsedData);
        let html = '<tbody><tr><td>id</td>';
        for (i in parsedData.fields) {
          html += '<td>'+parsedData.fields[i]+'</td>';
        }
        html += '</tr>';
        for (id in parsedData.records) {
          let record = parsedData.records[id];
          html += '<tr><td>'+id+'</td>';
          if (record) {
            for (i in parsedData.fields) {
              let field = parsedData.fields[i];
              let value = record[field] || '';
              html += '<td>'+value+'</td>';
            }
            html += '<td><button id="'+id+'" class="remove">X</button></td>';
          }
          html += '</tr>';
        }
        html += '</tbody>';
        $('tbody').remove();
        $('table').append(html);
        $('.remove').click(function(e) {
          let id = e.target.id;
          $.get('/remove?id='+id, function (data, status) {
            parse(data);
          })
        });
    }
    $('.create-table').click(function() {
      let name = prompt('Enter new table name');
      $.get('/table?name='+name, function(data, status) {
          window.location = '/';
      })
    })
    $('.find-by-id button').click(function() {
      let id = $('.find-by-id input').val()
      $.get('/find?id='+id, function(data, status) {
        $('.find-by-id .out').text(data);
      })
    })
    $('.find-by button').click(function() {
      let field = $('.find-by .find-field').val();
      let value = $('.find-by .find-value').val();
      $.get('/find?'+field+'='+value, function(data, status) {
        $('.find-by .out').text(data);
      })
    })
    $('.find-one-by button').click(function() {
      let field = $('.find-one-by .find-field').val();
      let value = $('.find-one-by .find-value').val();
      $.get('/findone?'+field+'='+value, function(data, status) {
        $('.find-one-by .out').text(data);
      })
    })
    
    $('#startauto').click(function(){
        let field = $('.autoflush input').val();
        $.get('/start?time='+field)
    })
    
    $('#stopauto').click(function(){
        $.get('/stop')
    })
    
    $('.add-button').click(function() {
        let query = '';
        let table = $('option:selected').val();
        if (table) {
          $('.add-form div').each(function() {
            let key = $(this).find('.key').val();
            let value = $(this).find('.value').val();
            query += key+'='+value+'&';
          });
          $.get('/save?'+query, function(data, status) {
            parse(data);    
          });
        }
    });
    $('.table').change(function() {
      let optionSelected = $('option:selected', this);
      let table = this.value;
      if (table) {
        $.get('/table?name='+table, function(data, status) {
          parse(data);
        })
      }
    });
    $('.add-field').click(function() {
        $('.add-form').append('<div class="field"><input type="text" placeholder="Key" class="key" /><input type="text" placeholder="Value" class="value"/></div>')
    });
    $('.flush').click(function() {
        $.get('/flush', function(data, status) {
            window.location = '/';
            alert('Flushed!');
        })
    })
})
